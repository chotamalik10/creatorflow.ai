# Public deployment (free-tier target)

## GitHub Pages
The repository contains a GitHub Actions workflow at `.github/workflows/pages.yml`. It is configured to enable GitHub Pages if needed and deploy the repository root when changes reach `main`.

1. Open the repository's **Actions** tab.
2. Check the latest **Deploy CreatorFlow PWA** run.
3. When it succeeds, open the deployment URL shown by the workflow. The expected project URL is `https://chotamalik10.github.io/creatorflow.ai/`.
4. Test the site on both desktop and a phone.
5. If the workflow reports a Pages permission or repository-policy error, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**, then rerun the workflow.

## Enable cloud accounts
Public static hosting does not create a database. To activate multi-user accounts and cross-device project sync:
1. Create a Supabase project on its free tier.
2. Run `supabase/schema.sql` in its SQL Editor.
3. Configure `config.js` with the Supabase Project URL and public anon/publishable key.
4. In Supabase Authentication URL settings, set the Site URL to the deployed Pages URL and add the local development URL to allowed redirects.
5. Redeploy after committing the public browser config.
6. Test with two different accounts and verify each account sees only its own projects.

Do not use a service-role key in `config.js`. RLS must remain enabled. Free plans have quotas and may pause inactive projects; review the provider's current limits.

## Important distinction
GitHub Pages hosts the static website only. It does not host the Python local server, Ollama model, FFmpeg renderer, or a background video worker. Local AI and MP4 rendering run on the computer where CreatorFlow's Python helper and the required tools are installed.
