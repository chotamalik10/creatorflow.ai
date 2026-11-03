#!/usr/bin/env python3
"""CreatorFlow AI local helper — standard library only."""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
OLLAMA_URL = "http://127.0.0.1:11434/api/generate"
LAST_AI_REQUEST: dict[str, float] = {}


def load_project(path: Path) -> dict[str, Any]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"Cannot read valid JSON from {path}: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError("Project must be a JSON object.")
    title = data.get("title")
    if not isinstance(title, str) or not title.strip():
        raise ValueError("Missing or invalid 'title'.")
    if data.get("format") not in {"Shorts", "Long-form"}:
        raise ValueError("'format' must be 'Shorts' or 'Long-form'.")
    if not isinstance(data.get("script", ""), str):
        raise ValueError("'script' must be text.")
    scenes = data.get("scenes", [])
    if not isinstance(scenes, list):
        raise ValueError("'scenes' must be a list.")
    for index, scene in enumerate(scenes, start=1):
        if not isinstance(scene, dict) or not isinstance(scene.get("name"), str):
            raise ValueError(f"Scene {index} must contain a text 'name'.")
    return data



def build_ai_prompt(payload: dict[str, Any]) -> tuple[str, str]:
    title = payload.get("title")
    video_format = payload.get("format", "Shorts")
    tone = payload.get("tone", "Friendly and clear")
    audience = payload.get("audience", "general viewers")
    if not isinstance(title, str) or not title.strip() or len(title) > 240:
        raise ValueError("Enter a video title (maximum 240 characters).")
    if video_format not in {"Shorts", "Long-form"}:
        raise ValueError("Format must be Shorts or Long-form.")
    if not isinstance(tone, str) or len(tone) > 80:
        raise ValueError("Tone must be a short text value.")
    if not isinstance(audience, str) or len(audience) > 120:
        raise ValueError("Audience must be a short text value.")
    model = payload.get("model", "qwen2.5:1.5b")
    if not isinstance(model, str) or not re.fullmatch(r"[A-Za-z0-9_.:/-]{1,100}", model):
        raise ValueError("Model name contains unsupported characters.")
    length = "about 120–180 spoken words" if video_format == "Shorts" else "about 800–1,100 spoken words"
    prompt = (
        "You are a careful YouTube scriptwriter. Write a complete, original script. "
        "Do not invent statistics, quotations, current events, sources, or factual claims. "
        "If a claim needs verification, mark it [VERIFY] instead of pretending it is proven. "
        "Use a strong opening hook, clear sections, natural spoken language, useful examples, "
        "and a concise call to action. Avoid filler and clickbait.\n\n"
        f"Video title/topic: {title.strip()}\n"
        f"Format: {video_format}; target length: {length}.\n"
        f"Audience: {audience.strip() or 'general viewers'}\n"
        f"Tone: {tone.strip() or 'Friendly and clear'}\n\n"
        "Return only the script with useful section headings. End with a short production note "
        "reminding the creator to verify factual claims and add sources."
    )
    return model, prompt


def command_validate(args: argparse.Namespace) -> int:
    try:
        project = load_project(args.file)
    except ValueError as exc:
        print(f"INVALID: {exc}", file=sys.stderr)
        return 1
    print("VALID CreatorFlow project")
    print(f"Title: {project['title']}")
    print(f"Format: {project['format']}")
    print(f"Scenes: {len(project.get('scenes', []))}")
    return 0


def command_serve(args: argparse.Namespace) -> int:
    directory = Path(args.directory).expanduser().resolve()
    if not directory.is_dir():
        print(f"Directory not found: {directory}", file=sys.stderr)
        return 2
    os.chdir(directory)


    class QuietHandler(SimpleHTTPRequestHandler):
        def _json(self, status: int, payload: dict[str, Any]) -> None:
            body = json.dumps(payload).encode("utf-8")
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(body)

        def do_GET(self) -> None:
            if self.path == "/api/health":
                try:
                    with urllib.request.urlopen("http://127.0.0.1:11434/api/tags", timeout=2) as response:
                        info = json.loads(response.read().decode("utf-8"))
                    models = [item.get("name", "") for item in info.get("models", [])]
                    self._json(HTTPStatus.OK, {"ok": True, "ollama": True, "models": models})
                except (OSError, urllib.error.URLError, json.JSONDecodeError):
                    self._json(HTTPStatus.OK, {"ok": True, "ollama": False, "models": []})
                return
            super().do_GET()

        def do_POST(self) -> None:
            if self.path != "/api/ai/generate":
                self._json(HTTPStatus.NOT_FOUND, {"error": "Endpoint not found."})
                return
            origin = self.headers.get("Origin")
            host = self.headers.get("Host", "")
            if origin:
                from urllib.parse import urlsplit
                if urlsplit(origin).netloc != host:
                    self._json(HTTPStatus.FORBIDDEN, {"error": "Cross-origin requests are not allowed."})
                    return
            try:
                size = int(self.headers.get("Content-Length", "0"))
            except ValueError:
                size = 0
            if size < 1 or size > 16000:
                self._json(HTTPStatus.REQUEST_ENTITY_TOO_LARGE, {"error": "Request body is empty or too large."})
                return
            client_ip = self.client_address[0]
            now = time.monotonic()
            if now - LAST_AI_REQUEST.get(client_ip, 0) < 3:
                self._json(HTTPStatus.TOO_MANY_REQUESTS, {"error": "Please wait a few seconds before another generation."})
                return
            try:
                payload = json.loads(self.rfile.read(size).decode("utf-8"))
                if not isinstance(payload, dict):
                    raise ValueError("Request must be a JSON object.")
                model, prompt = build_ai_prompt(payload)
            except (UnicodeDecodeError, json.JSONDecodeError, ValueError) as exc:
                self._json(HTTPStatus.BAD_REQUEST, {"error": str(exc)})
                return
            LAST_AI_REQUEST[client_ip] = now
            request_body = json.dumps({"model": model, "prompt": prompt, "stream": False, "options": {"temperature": 0.7, "num_predict": 1800}}).encode("utf-8")
            request = urllib.request.Request(OLLAMA_URL, data=request_body, headers={"Content-Type": "application/json"}, method="POST")
            try:
                with urllib.request.urlopen(request, timeout=240) as response:
                    result = json.loads(response.read().decode("utf-8"))
                generated = result.get("response", "")
                if not isinstance(generated, str) or not generated.strip():
                    raise ValueError("The local model returned an empty response.")
                self._json(HTTPStatus.OK, {"response": generated, "model": model})
            except urllib.error.HTTPError as exc:
                self._json(HTTPStatus.BAD_GATEWAY, {"error": f"Ollama returned HTTP {exc.code}. Check that the model is installed."})
            except (urllib.error.URLError, TimeoutError, OSError):
                self._json(HTTPStatus.SERVICE_UNAVAILABLE, {"error": "Ollama is not running. Start Ollama and download the selected model first."})
            except (json.JSONDecodeError, ValueError):
                self._json(HTTPStatus.BAD_GATEWAY, {"error": "Ollama returned an invalid or empty response."})

        def log_message(self, fmt: str, *values: object) -> None:
            print(f"[CreatorFlow] {self.address_string()} - {fmt % values}")

    server = ThreadingHTTPServer((args.host, args.port), QuietHandler)
    print("CreatorFlow local web server")
    print(f"Folder: {directory}")
    print(f"Open on this computer: http://127.0.0.1:{args.port}")
    if args.host in {"0.0.0.0", ""}:
        print("For a phone on the same Wi-Fi, open http://YOUR-LAPTOP-IP:"
              f"{args.port} (find the IP with ipconfig).")
        print("This is a trusted local-network development server, not public hosting.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping CreatorFlow server...")
    finally:
        server.server_close()
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="creatorflow",
        description="Free, dependency-free local tools for CreatorFlow AI.",
    )
    commands = parser.add_subparsers(dest="command", required=True)
    validate = commands.add_parser("validate", help="Validate an exported project JSON.")
    validate.add_argument("file", type=Path)
    validate.set_defaults(func=command_validate)
    serve = commands.add_parser("serve", help="Serve the CreatorFlow web app locally.")
    serve.add_argument("--host", default="127.0.0.1",
                       help="Use 0.0.0.0 for access from a phone on the same Wi-Fi.")
    serve.add_argument("--port", type=int, default=8000)
    serve.add_argument("--directory", type=Path, default=ROOT)
    serve.set_defaults(func=command_serve)
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    if hasattr(args, "port") and not (1 <= args.port <= 65535):
        parser.error("--port must be between 1 and 65535")
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
