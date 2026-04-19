import json
import os
import time
import urllib.request
import urllib.error


def handler(event: dict, context) -> dict:
    """Мониторинг доступности микросервисов. Принимает список URL, возвращает статус каждого."""

    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
        "Content-Type": "application/json",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": ""}

    token = event.get("headers", {}).get("X-Admin-Token", "")
    expected = os.environ.get("ADMIN_TOKEN", "")
    if not expected or token != expected:
        return {
            "statusCode": 401,
            "headers": cors_headers,
            "body": json.dumps({"error": "Unauthorized"}),
        }

    body = json.loads(event.get("body") or "{}")
    targets = body.get("targets", [])

    if not isinstance(targets, list) or len(targets) == 0:
        return {
            "statusCode": 400,
            "headers": cors_headers,
            "body": json.dumps({"error": "targets must be a non-empty list of URLs"}),
        }

    results = []
    for url in targets:
        start = time.time()
        try:
            req = urllib.request.Request(url, method="GET")
            with urllib.request.urlopen(req, timeout=3) as resp:
                status_code = resp.status
        except urllib.error.HTTPError as e:
            status_code = e.code
        except Exception:
            status_code = None

        elapsed_ms = round((time.time() - start) * 1000)
        ok = status_code is not None and status_code < 500

        results.append({
            "url": url,
            "status_code": status_code,
            "response_time_ms": elapsed_ms,
            "ok": ok,
        })

    return {
        "statusCode": 200,
        "headers": cors_headers,
        "body": json.dumps({"results": results}),
    }
