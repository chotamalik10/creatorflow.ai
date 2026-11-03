# CreatorFlow AI

**A free-first, mobile-friendly workspace for YouTube creators.**

CreatorFlow AI is an open-source project for turning a video idea into a structured script and production plan. The goal is a public multi-user platform with an optional local/self-hosted mode, built without mandatory paid APIs.

> **Honest status:** The local-first web app, Windows helper, optional Supabase account/cloud-sync integration, local Ollama script drafting and local FFmpeg slideshow renderer are implemented. Cloud accounts require owner-supplied Supabase configuration and a real two-account isolation test before public launch. Live trend research, downloadable generated voice tracks, stock-media sourcing, full AI editing/rendering inside the hosted dashboard, YouTube OAuth/publishing and analytics are not implemented.

## Current features
- Responsive, installable PWA shell
- Niche-based brainstorming prompts (not live trend data)
- Shorts and long-form script structures
- Editable scripts and word count
- Scene-by-scene visual direction, narration and duration planning
- Browser speech preview using voices installed on the device (preview only; no MP3 export)
- Editable caption preparation and SRT subtitle download with estimated timings
- Downloadable script text and shot-list CSV
- Browser-local project saving
- JSON project export and text brief copy
- Python terminal helper with no third-party dependencies
- Optional local AI script drafting through Ollama when using the local server
- Local MP4 slideshow rendering from creator-owned/licensed images and optional audio via FFmpeg
- Initial Supabase schema with per-user Row Level Security policies
- Optional email/password auth and private cloud project sync (requires your Supabase project configuration)

## Public website deployment
The repository includes a GitHub Pages workflow. Before its first successful deployment, the repository owner must open **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**. Then pushes to `main` deploy the static PWA. Expected project URL: `https://chotamalik10.github.io/creatorflow.ai/`. Confirm the deployment in the repository's **Actions** tab before sharing the URL. Add the final site URL to Supabase's allowed authentication redirect URLs after cloud auth is configured. See [Deployment guide](docs/DEPLOYMENT.md).

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
- Local Ollama is an optional AI route for users with a capable computer. The local Python server provides the drafting endpoint; the hosted static site does not run AI itself.
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
5. [ ] Live Supabase signup/login and two-account RLS isolation verification
6. [x] Optional local Ollama script drafting in local server mode
7. [x] Local slideshow MP4 rendering with FFmpeg
8. [x] Caption preparation, SRT export, narration preview and shot-list CSV
9. [ ] YouTube OAuth, explicit publishing approval and analytics
10. [ ] Security, accessibility and deployment verification

## Security and responsible use
- Never commit API keys, service-role keys, OAuth secrets or access tokens.
- Enforce ownership in database Row Level Security, not only in frontend code.
- Verify research and retain source links.
- Respect copyright, licenses, privacy and platform policies.
- Keep a human approval step before publishing.

See [Architecture](docs/ARCHITECTURE.md), [Deployment](docs/DEPLOYMENT.md), [Cloud setup](docs/CLOUD_SETUP.md), [Local setup](docs/LOCAL_SETUP.md), [Contributing](CONTRIBUTING.md) and [MIT License](LICENSE).
