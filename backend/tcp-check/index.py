import json
import os
import socket
import time


def handler(event: dict, context) -> dict:
    """Проверка доступности TCP-портов на заданном хосте."""

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
    host = body.get("host", "").strip()
    ports = body.get("ports", [])

    if not host:
        return {
            "statusCode": 400,
            "headers": cors_headers,
            "body": json.dumps({"error": "host is required"}),
        }

    if not isinstance(ports, list) or len(ports) == 0:
        return {
            "statusCode": 400,
            "headers": cors_headers,
            "body": json.dumps({"error": "ports must be a non-empty list of integers"}),
        }

    results = []
    for port in ports:
        start = time.time()
        try:
            conn = socket.create_connection((host, int(port)), timeout=3)
            conn.close()
            open_ = True
        except Exception:
            open_ = False

        elapsed_ms = round((time.time() - start) * 1000)
        results.append({"port": int(port), "open": open_, "response_time_ms": elapsed_ms})

    return {
        "statusCode": 200,
        "headers": cors_headers,
        "body": json.dumps({"host": host, "results": results}),
    }
