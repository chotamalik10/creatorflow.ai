# Supabase account and cloud sync setup

This enables optional account login and private cloud project sync. Local mode remains available without it.

## 1. Create a free Supabase project
Create a project in the Supabase dashboard. The free plan has quotas and may pause inactive projects; it is not unlimited hosting.

## 2. Create the project table
Open **SQL Editor** and run the complete contents of `supabase/schema.sql`. The table uses Row Level Security (RLS), so authenticated users can only read, create, update, and delete rows they own.

## 3. Configure the public browser keys
In Supabase project settings, copy the **Project URL** and the **anon / publishable key**. Put them in `config.js`:

```js
window.CREATORFLOW_CONFIG = {
  supabaseUrl: "https://YOUR-PROJECT.supabase.co",
  supabaseAnonKey: "YOUR_PUBLIC_ANON_OR_PUBLISHABLE_KEY"
};
```

The anon/publishable key is intended to be visible in browser apps; the database is protected by RLS. **Never use the service-role key here.** Keep all AI provider secrets and OAuth secrets on a trusted backend.

## 4. Set allowed authentication URLs
In Supabase Authentication URL settings:
- Set the Site URL to your deployed website origin.
- Add your local development URL (for example `http://localhost:8000/**`) to the redirect allow list.
- Configure email verification and password reset email templates as desired.

## 5. Deploy
Commit `config.js` and deploy the static site. The config file contains public client settings only. If you use a public repository, understand that anyone can read this file; this is expected for an anon key, and RLS is mandatory.

## 6. Test isolation
Create two separate test accounts. Save a project under account A and verify account B cannot see it. Do not launch public cloud sync until this check passes.

## Current limitations
- Email/password sign-up, sign-in, password reset requests, sign-out, cloud project loading and manual local-project upload are implemented in the frontend.
- Cloud auth/sync cannot work until you configure a Supabase project, run the SQL, set redirect URLs and deploy.
- Email delivery and project availability depend on Supabase's current free-plan limits.
- No service-role key is required by this frontend integration.
