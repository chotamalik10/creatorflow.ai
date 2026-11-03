#!/usr/bin/env python3
"""CreatorFlow AI local helper — standard library only."""
from __future__ import annotations

import argparse
import json
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]


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
