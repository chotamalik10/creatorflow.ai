# CreatorFlow AI — Free-first architecture

## Product goal
CreatorFlow AI is a public, multi-user creator workspace that also supports a local self-hosted mode. The same repository should serve the hosted website and a user's own Windows laptop, including access from a phone on the same Wi-Fi network.

## Architecture
- **Web app:** static, mobile-first PWA. Keep the frontend deployable on a free static host.
- **Hosted identity and data:** Supabase Auth + PostgreSQL. Browser clients use only the project's public anon/publishable key; database Row Level Security (RLS) enforces ownership.
- **Local mode:** the existing browser workspace remains available without an account and stores drafts on that device. Local mode must be clearly labelled and must never imply cloud sync.
- **AI:** provider adapters are optional. Local Ollama can be used on a capable computer; hosted AI providers are opt-in and may have their own quotas/costs. Never ship provider secrets to the browser.
- **Media processing:** FFmpeg is an optional local worker for rendering. Do not promise background cloud rendering on a free static host.
- **YouTube:** OAuth and publishing are separate opt-in integrations. Human review must remain before publishing.

## Free-first deployment
A free-tier deployment is possible for a small beta, but free plans have quotas, limits, and policy changes. This repository must not promise unlimited usage or zero-cost operation at any scale. The owner must configure their own Supabase project and hosting account. No paid API is required for the local planning features.

## Security boundaries
1. Never put service-role keys, OAuth client secrets, AI provider keys, or private tokens in frontend files.
2. Use Supabase RLS for every user-owned table. Do not rely on hiding records in the UI.
3. Treat imported project JSON and user-generated text as untrusted input.
4. Keep publishing disabled until OAuth scopes, token storage, and explicit user confirmation are implemented.
5. Avoid collecting unnecessary personal information.

## Current implementation status
The current frontend is a local planning prototype. The SQL schema in `supabase/schema.sql` defines the first cloud data layer, but cloud login/sync is not active until a Supabase project is configured and the client integration is implemented and tested.

## Delivery phases
1. Foundation, documentation, schema, and local workflow.
2. Supabase authentication, per-user cloud projects, migration/export and RLS tests.
3. AI provider adapter with local Ollama and optional user-supplied provider configuration.
4. Production pipeline (captions/assets/rendering) with clear local resource requirements.
5. YouTube OAuth, publishing approvals, and analytics.
6. CI checks, accessibility, security review, and deployment verification.
