# CreatorFlow AI

**A free-first, mobile-friendly workspace for YouTube creators.**

CreatorFlow AI is an open-source project for turning a video idea into a structured script and production plan. The goal is a public multi-user platform with an optional local/self-hosted mode, built without mandatory paid APIs.

> **Honest status:** The current web app is a local-first planning prototype. Idea prompts, editable scripts, scene planning, local browser saving and JSON export are implemented. The cloud SQL foundation and terminal helper are being added. Cloud login/sync, live AI research, generated voice, media sourcing, video rendering, YouTube publishing and analytics are not active yet.

## Current features
- Responsive, installable PWA shell
- Niche-based brainstorming prompts (not live trend data)
- Shorts and long-form script structures
- Editable scripts and word count
- Scene, voiceover and audio planning
- Browser-local project saving
- JSON project export and text brief copy
- Python terminal helper with no third-party dependencies
- Initial Supabase schema with per-user Row Level Security policies
- Optional email/password auth and private cloud project sync (requires your Supabase project configuration)

## Run on Windows
Install Git and Python 3, then open PowerShell:

```powershell
git clone https://github.com/chotamalik10/creatorflow.ai.git
cd creatorflow.ai
py tools/creatorflow.py serve
```

Open http://127.0.0.1:8000.

### Open from your phone on the same Wi-Fi
Run:

```powershell
py tools/creatorflow.py serve --host 0.0.0.0
```

Find the laptop's IPv4 address with `ipconfig`, then open `http://YOUR-LAPTOP-IP:8000` on the phone. This is local network access only; it does not publish your laptop to the internet. Use a trusted Wi-Fi network.

### Validate an exported project
```powershell
py tools/creatorflow.py validate .\creatorflow-project.json
```

## Free-first architecture
- Static PWA hosting can use GitHub Pages or Cloudflare Pages free tiers.
- Supabase Auth/Postgres can provide a small beta's login and private cloud projects on its free tier.
- Local Ollama is an optional AI route for users with a capable computer.
- FFmpeg is an optional local rendering tool.
- No AI provider key is needed for the current planning features.

Free services have quotas, limitations and policies that can change. This project does not promise unlimited free hosting, unlimited AI generation or cloud video rendering. Local mode remains usable without cloud credentials.

## Cloud database foundation
1. Create a Supabase project.
2. Open its SQL Editor.
3. Run `supabase/schema.sql`.
4. Do not expose the service-role key in frontend code.

Configure `config.js` with your Supabase project URL and public anon/publishable key after running the schema. The frontend supports sign-up, sign-in, password reset requests, sign-out, cloud loading and manual local-project upload. Cloud sync is unavailable until a real Supabase project is configured and tested. Never put a service-role key in `config.js`.

## Roadmap
1. [x] Local-first planning prototype
2. [x] Free-first architecture and initial private-project database schema
3. [x] Dependency-free Windows CLI / local Wi-Fi serving helper
4. [x] Supabase browser auth and private cloud sync integration (configuration required)
5. [ ] Supabase signup/login, password recovery and cloud project sync integration tests / two-account isolation test
6. [ ] Automated tests for data isolation and authentication
7. [ ] Optional local AI provider adapter (Ollama)
8. [ ] Caption/asset workflow and local FFmpeg rendering
9. [ ] YouTube OAuth, explicit publishing approval and analytics
10. [ ] Security, accessibility and deployment verification

## Security and responsible use
- Never commit API keys, service-role keys, OAuth secrets or access tokens.
- Enforce ownership in database Row Level Security, not only in frontend code.
- Verify research and retain source links.
- Respect copyright, licenses, privacy and platform policies.
- Keep a human approval step before publishing.

See [Architecture](docs/ARCHITECTURE.md), [Local setup](docs/LOCAL_SETUP.md), [Contributing](CONTRIBUTING.md) and [MIT License](LICENSE).
