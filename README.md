# CreatorFlow AI

**Your mobile-first AI content studio — from idea to production-ready video.**

CreatorFlow AI is an open-source project designed to help busy creators plan YouTube videos and Shorts from a phone.

> **Current status:** Foundation / MVP prototype. The current app provides local brainstorming and project planning. Live AI research, voice generation, media sourcing, video rendering and YouTube publishing are not implemented yet.

## MVP features
- Responsive mobile-first dashboard and installable PWA shell
- Niche and format selection with idea starter prompts
- Editable script structure for Shorts and long-form videos
- Scene, voiceover and audio planning
- Local project saving in the browser
- Project JSON and text brief export

## Run locally
```bash
git clone https://github.com/chotamalik10/creatorflow.ai.git
cd creatorflow.ai
python -m http.server 8000
```
Open http://localhost:8000. PWA installation requires HTTPS or localhost.

## Roadmap
1. Mobile-first foundation and project workspace
2. Provider-backed topic research, idea scoring and titles
3. Script studio with source citations
4. Licensed/creator-provided visuals, voiceover and captions
5. Background video rendering with FFmpeg
6. Opt-in YouTube OAuth, scheduling and analytics
7. Security, tests, accessibility and deployment guides

## Architecture
The first release is a static PWA to keep hosting simple. Future AI and media features should use a backend API so provider credentials are never exposed in browser code. Video rendering should run in a background worker, not in a mobile browser.

## Responsible use
Verify research and retain source links. Respect copyright, licenses, privacy and platform policies. Keep human approval before publishing. Never commit API keys or OAuth tokens.

See CONTRIBUTING.md. Licensed under MIT; see LICENSE.