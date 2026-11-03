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


## Optional local AI script drafting (no paid API)

CreatorFlow can send script prompts from the browser to Ollama running on the same laptop. If you open CreatorFlow from your phone on the same Wi-Fi, the laptop runs the model and sends the draft back to the phone.

1. Install Ollama for Windows from the official Ollama website.
2. Open PowerShell and download a small model once:

```powershell
ollama pull qwen2.5:1.5b
```

3. Make sure Ollama is running. Check installed models with `ollama list`.
4. In the CreatorFlow folder, start the local server:

```powershell
py tools/creatorflow.py serve --host 0.0.0.0
```

5. Open CreatorFlow on the laptop at `http://127.0.0.1:8000`, or on your phone using the laptop IPv4 address and port 8000.
6. Open Script Studio, enter a title, choose a model installed in Ollama, then tap **Draft script with local AI**.

### Performance and privacy
- The first model download uses internet; generation runs on your own computer.
- A 1.5B model is a small starting point. It may be slow on older CPUs and produces simpler writing than larger models.
- For very limited memory, try `qwen2.5:0.5b` instead.
- Prompts are sent to Ollama on the laptop through the local CreatorFlow server, not to a paid AI provider.
- Use LAN mode only on a trusted private Wi-Fi network. Do not expose the development server to the public internet.
- The hosted static website cannot access your laptop's Ollama service; local AI works in local server mode only.
