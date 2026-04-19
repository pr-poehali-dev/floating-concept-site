import json
import os
import psycopg2
import urllib.request
import urllib.error


CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Authorization, X-User-Id, X-Session-Id",
    "Access-Control-Max-Age": "86400",
}


def handler(event: dict, context) -> dict:
    """
    Webhook debugger — логирует все входящие запросы в webhook_log.
    GET ?action=list — возвращает последние 50 записей (требует X-Authorization).
    Все остальные запросы логируются и возвращают 200 OK.
    """
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    headers = event.get("headers") or {}
    query_params = event.get("queryStringParameters") or {}
    method = event.get("httpMethod", "UNKNOWN")

    action = query_params.get("action", "")

    if action == "list":
        token = headers.get("X-Authorization", "")
        if token != os.environ.get("ADMIN_TOKEN", ""):
            return {
                "statusCode": 401,
                "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
                "body": json.dumps({"error": "Unauthorized"}),
            }

        conn = psycopg2.connect(os.environ["DATABASE_URL"])
        cur = conn.cursor()
        cur.execute(
            "SELECT id, ts::text, method, headers, query_params, body "
            "FROM webhook_log ORDER BY ts DESC LIMIT 50"
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()

        records = [
            {
                "id": r[0],
                "ts": r[1],
                "method": r[2],
                "headers": r[3],
                "query_params": r[4],
                "body": r[5],
            }
            for r in rows
        ]
        return {
            "statusCode": 200,
            "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
            "body": json.dumps({"records": records}),
        }

    query_str = json.dumps(query_params) if query_params else None
    body = event.get("body") or None

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO webhook_log (method, headers, query_params, body) VALUES (%s, %s, %s, %s)",
        (method, json.dumps(headers), query_str, body),
    )
    conn.commit()
    cur.close()
    conn.close()

    upstream_url = os.environ.get("UPSTREAM_URL", "").strip()
    if not upstream_url:
        return {
            "statusCode": 200,
            "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
            "body": json.dumps({"ok": True, "logged": True}),
        }

    # Пересылаем запрос на upstream
    # Добавляем query string, если есть
    if query_params:
        from urllib.parse import urlencode
        upstream_url = upstream_url.rstrip("/") + "?" + urlencode(query_params)

    body_bytes = body.encode("utf-8") if body else None

    # Формируем заголовки для upstream (пропускаем служебные hop-by-hop)
    skip_headers = {"host", "content-length", "transfer-encoding", "connection"}
    forward_headers = {
        k: v for k, v in headers.items()
        if k.lower() not in skip_headers
    }
    if body_bytes and "Content-Type" not in forward_headers:
        forward_headers["Content-Type"] = "application/json"

    req = urllib.request.Request(
        upstream_url,
        data=body_bytes,
        headers=forward_headers,
        method=method,
    )

    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            upstream_status = resp.status
            upstream_body = resp.read().decode("utf-8", errors="replace")
            upstream_ct = resp.headers.get("Content-Type", "application/json")
    except urllib.error.HTTPError as e:
        upstream_status = e.code
        upstream_body = e.read().decode("utf-8", errors="replace")
        upstream_ct = e.headers.get("Content-Type", "application/json")
    except urllib.error.URLError as e:
        upstream_status = 502
        upstream_body = json.dumps({"error": "upstream_unreachable", "detail": str(e.reason)})
        upstream_ct = "application/json"

    return {
        "statusCode": upstream_status,
        "headers": {**CORS_HEADERS, "Content-Type": upstream_ct},
        "body": upstream_body,
    }