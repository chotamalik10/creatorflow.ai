# Contributing

Thanks for helping improve CreatorFlow AI.

## Project principles

- Keep local planning and exports usable without an account or paid API.
- Be explicit about which features run locally and which require hosted configuration.
- Never claim that a mock, browser preview, or local-only feature is cloud processing.
- Keep a human approval step before any future publishing integration.
- Respect copyright, privacy, and platform terms.

## Run checks locally

```bash
python -m unittest discover -s tests -v
python -m compileall -q tools tests
python tools/creatorflow.py --help
```

If Node.js is installed, also run:

```bash
node --check app.js
```

## Pull request checklist

- [ ] Tests cover changed behavior.
- [ ] Local-first functionality still works without Supabase credentials.
- [ ] No secrets, service-role keys, or OAuth client secrets are committed.
- [ ] Cloud data access remains protected by Row Level Security.
- [ ] User-facing copy accurately describes implemented functionality.
- [ ] Mobile layout and keyboard accessibility have been considered.
