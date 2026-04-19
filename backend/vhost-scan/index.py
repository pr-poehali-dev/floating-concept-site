import json
import os
import time
import urllib.request
import urllib.error


def handler(event: dict, context) -> dict:
    """Проверка виртуальных хостов на балансировщике по IP:порт с подстановкой Host-заголовка."""

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
    target = body.get("target", "").strip()
    hosts = body.get("hosts", [])

    if not target:
        return {
            "statusCode": 400,
            "headers": cors_headers,
            "body": json.dumps({"error": "target is required (format: ip:port)"}),
        }

    if not isinstance(hosts, list) or len(hosts) == 0:
        return {
            "statusCode": 400,
            "headers": cors_headers,
            "body": json.dumps({"error": "hosts must be a non-empty list of hostnames"}),
        }

    results = []
    for hostname in hosts:
        url = f"http://{target}/"
        start = time.time()
        status_code = None
        content_length = None
        title = None
        try:
            req = urllib.request.Request(url, headers={"Host": hostname}, method="GET")
            with urllib.request.urlopen(req, timeout=3) as resp:
                status_code = resp.status
                raw = resp.read(4096)
                content_length = int(resp.headers.get("Content-Length", 0)) or len(raw)
                text = raw.decode("utf-8", errors="ignore")
                if "<title>" in text.lower():
                    start_idx = text.lower().index("<title>") + 7
                    end_idx = text.lower().find("</title>", start_idx)
                    title = text[start_idx:end_idx].strip() if end_idx != -1 else None
        except urllib.error.HTTPError as e:
            status_code = e.code
        except Exception:
            status_code = None

        elapsed_ms = round((time.time() - start) * 1000)
        results.append({
            "hostname": hostname,
            "status_code": status_code,
            "response_time_ms": elapsed_ms,
            "content_length": content_length,
            "title": title,
            "ok": status_code is not None and status_code < 500,
        })

    return {
        "statusCode": 200,
        "headers": cors_headers,
        "body": json.dumps({"target": target, "results": results}),
    }
