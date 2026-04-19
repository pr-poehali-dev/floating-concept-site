import json
import os
import psycopg2


CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Authorization",
    "Access-Control-Max-Age": "86400",
}


def handler(event: dict, context) -> dict:
    """
    Читает все записи из webhook_log и возвращает только те,
    где в заголовках есть Authorization. Показывает значение ключа.
    Требует X-Authorization с ADMIN_TOKEN.
    """
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    token = (event.get("headers") or {}).get("X-Authorization", "")
    if token != os.environ.get("ADMIN_TOKEN", ""):
        return {
            "statusCode": 401,
            "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
            "body": json.dumps({"error": "Unauthorized"}),
        }

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()
    cur.execute(
        "SELECT id, ts::text, method, headers, query_params, body FROM webhook_log ORDER BY ts DESC"
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    result = []
    for r in rows:
        headers = r[3] or {}
        auth_value = (
            headers.get("Authorization")
            or headers.get("authorization")
            or headers.get("AUTHORIZATION")
        )
        if auth_value:
            result.append({
                "id": r[0],
                "ts": r[1],
                "method": r[2],
                "authorization": auth_value,
                "query_params": r[4],
                "body": r[5],
            })

    return {
        "statusCode": 200,
        "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
        "body": json.dumps({"total_with_auth": len(result), "records": result}),
    }
