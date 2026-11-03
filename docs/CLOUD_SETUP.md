# Supabase account and cloud sync setup

This enables optional account login and private cloud project sync. Local mode remains available without it.

## 1. Create a Supabase project
Create a project in the Supabase dashboard. The free plan has quotas and may pause inactive projects; it is not unlimited hosting.

## 2. Create the project table
Open **SQL Editor** and run the complete contents of `supabase/schema.sql`. The table uses Row Level Security (RLS), so authenticated users can only read, create, update, and delete rows they own.

## 3. Configure the public browser keys
In Supabase **Project Settings → API**, copy the **Project URL** and the **anon / publishable key**. Put them in `config.js`:

```js
window.CREATORFLOW_CONFIG = {
  supabaseUrl: "https://YOUR-PROJECT.supabase.co",
  supabaseAnonKey: "YOUR_PUBLIC_ANON_OR_PUBLISHABLE_KEY"
};
```

The anon/publishable key is intended to be visible in browser apps; the database is protected by RLS. **Never use the service-role key here.** Keep AI provider secrets and OAuth client secrets on a trusted backend.

## 4. Enable Google sign-in (required for the Google button)

The Google button calls Supabase Auth with provider `google`. The provider must be enabled in the Supabase project; adding frontend code or changing the public key cannot enable it.

1. Open **Supabase Dashboard → Authentication → Sign In / Providers → Google**.
2. Enable Google.
3. Add the Google OAuth **Client ID** and **Client Secret** from a Google Cloud OAuth client configured for a Web application.
4. In Google Cloud Console, add the Supabase callback URL shown on the Supabase Google provider page to the OAuth client's **Authorized redirect URIs**. It usually has the form `https://YOUR-PROJECT.supabase.co/auth/v1/callback`; copy the exact value from your project.
5. Save the provider settings in Supabase.

If the app shows **Unsupported provider**, Google is not enabled for the Supabase project URL currently configured in `config.js`, or the frontend is pointing at a different Supabase project. Check the provider toggle and verify the project URL before changing application code.

The app also includes GitHub sign-in. Enable the GitHub provider and configure its OAuth app in Supabase before using that button.

## 5. Set allowed authentication URLs
In Supabase **Authentication → URL Configuration**:
- Set the Site URL to your deployed website origin.
- Add your local development URL (for example `http://localhost:8000/**`) to the redirect allow list.
- Add the exact GitHub Pages URL, including the repository path, if you use GitHub Pages.
- Configure email verification and password reset email templates as desired.

## 6. Deploy
Commit `config.js` and deploy the static site. The config file contains public client settings only. If you use a public repository, understand that anyone can read this file; this is expected for an anon key, and RLS is mandatory.

## 7. Test isolation
Create two separate test accounts. Save a project under account A and verify account B cannot see it. Test create, update, and delete permissions as well. Do not launch public cloud sync until these checks pass.

## Current limitations
- Email/password sign-up, sign-in, password reset requests, sign-out, cloud project loading and manual local-project upload are implemented in the frontend.
- Google and GitHub OAuth require provider credentials and dashboard configuration as described above.
- Cloud auth/sync cannot work until you configure a Supabase project, run the SQL, set redirect URLs and deploy.
- Email delivery and project availability depend on Supabase's current free-plan limits.
- No service-role key is required by this frontend integration.
