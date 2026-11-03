# Multi-platform Creator Studio

CreatorFlow AI is a shared production workspace for **YouTube and Facebook**. It is not a YouTube-only automation tool.

## Product rules

- Every project must store a platform target: YouTube, Facebook, or both.
- Every project must store a destination format appropriate to its platform.
- Shared production assets (research notes, script, scene plan, narration, captions and media) are reusable across destinations.
- Platform-specific packaging must be separate: title/description/tags for YouTube; post copy, page destination and Facebook-specific metadata for Facebook.
- Publishing must remain an explicit, user-approved action. Never auto-publish as a side effect of saving or exporting.
- Never show a connected/published status unless the platform API confirms it.

## Supported content targets

| Platform | Formats | Packaging |
|---|---|---|
| YouTube | Shorts, long-form video | Title, description, tags, thumbnail, visibility |
| Facebook | Reels, video posts | Post caption, page destination, audience/visibility |

## Production pipeline

1. **Discover** — niche and idea brainstorming. Live trend research is a separate integration and must show sources and retrieval time.
2. **Research** — source-backed notes, claims to verify and reference links.
3. **Write** — platform-aware scripts with target duration and audience.
4. **Plan** — scenes, visual direction, narration and shot list.
5. **Produce audio** — voice preview or a real downloadable audio file from a configured TTS engine. Do not label browser speech preview as an audio export.
6. **Create visuals** — creator-owned or properly licensed media, with attribution and usage notes.
7. **Edit and render** — real timeline/render job with progress, errors and a downloadable output. Local FFmpeg and cloud rendering must be clearly distinguished.
8. **Package** — generate platform-specific metadata and export files.
9. **Publish** — optional official API integration, with OAuth, secure token storage, permission checks, explicit final confirmation and a result returned by the platform.
10. **Measure** — analytics only when an official API connection supplies the metrics.

## Current implementation versus roadmap

The current app has local project planning, a local Ollama script-drafting route, scene planning, browser speech preview, caption/SRT export, shot-list CSV and a local FFmpeg slideshow helper. It does **not** yet have live trends, automated source research, stock-media retrieval, downloadable generated voice tracks, a full timeline editor, hosted rendering, YouTube/Facebook OAuth publishing or analytics.

Do not present a placeholder, prompt template, browser preview or local-only command as a completed cloud automation feature.

## Architecture requirements

- Keep the static PWA usable without paid services.
- Keep AI and rendering behind provider/worker adapters; never expose provider secrets in browser code.
- Keep each user's projects private with database Row Level Security.
- Store platform targets and destination metadata in each project, not in global browser state.
- Use migrations for schema changes and test RLS with at least two independent accounts.
- Add automated tests for project migration, platform validation, exports and rendering helpers.
- Keep publishing disabled until OAuth/token security and user approval have been implemented and tested.

## Delivery order

1. Multi-platform project model and UI (YouTube / Facebook / both).
2. Platform-specific metadata forms and export bundles.
3. Reliable research and AI provider adapters with visible source/provenance.
4. Real downloadable audio and asset workflow.
5. Rendering pipeline with job status and failure handling.
6. Separate YouTube and Facebook official OAuth/publishing adapters.
7. Per-platform analytics and final security/accessibility review.
