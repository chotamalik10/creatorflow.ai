# Security Policy

## Reporting a vulnerability

Do not publish credentials, access tokens, private user data, or exploitable details in a public issue. Use GitHub's private vulnerability reporting feature for this repository when available.

Include the affected commit, impact, and minimal reproduction steps. Redact all secrets and personal project content.

## Security expectations

- Never commit Supabase service-role keys, OAuth client secrets, AI provider secrets, or user access tokens.
- The browser anon/publishable key is public by design; database security must come from strict Row Level Security policies.
- Test project isolation with two separate accounts before enabling public cloud sync.
- Keep user projects private to their authenticated owner.
- Treat imported project JSON and generated text as untrusted input.
- Use only media that you own or are licensed to use.
- Do not add automatic publishing without explicit user approval and secure OAuth handling.
