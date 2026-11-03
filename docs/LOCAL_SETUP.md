# Run CreatorFlow AI locally

## Windows (PowerShell)
1. Install Git and Python 3 if they are not already installed.
2. Open PowerShell and run:

```powershell
git clone https://github.com/chotamalik10/creatorflow.ai.git
cd creatorflow.ai
py -m http.server 8000 --bind 0.0.0.0
```

3. On the laptop, open `http://localhost:8000`.
4. To open it on a phone connected to the same Wi-Fi, find the laptop's IPv4 address with `ipconfig`, then open `http://YOUR-LAPTOP-IP:8000` on the phone.

## Important
- This is a local network development server, not public internet hosting.
- Keep the laptop and phone on the same trusted Wi-Fi. Do not expose Python's development server directly to the public internet.
- Local projects are saved in that browser's storage. They do not automatically sync between devices.
- Installable PWA features require HTTPS or localhost; the phone's plain LAN address may not support installation.
- Stop the server with `Ctrl+C`.

## Local-first usage
You can use the idea, script, scene-planning, and JSON export features without configuring an AI API or cloud account.
