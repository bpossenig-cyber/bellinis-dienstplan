# Erst-Onboarding

Dieses Onboarding erstellt:

- erste Organisation
- ersten Admin in Supabase Auth
- zugehoeriges Profil in `public.users`
- zugehoerigen Eintrag in `public.staff`

## Voraussetzungen

- Migration wurde ausgefuehrt (`supabase db push`)
- Service Role Key ist bekannt

## Ausfuehrung

1. `.env` mit folgenden Werten befuellen:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `BELLINIS_ORG_NAME`
   - `BELLINIS_ADMIN_EMAIL`
   - `BELLINIS_ADMIN_PASSWORD`
   - `BELLINIS_ADMIN_NAME`

2. Onboarding starten:

```bash
npm run onboard:admin
```

## Sicherheitshinweis

`SUPABASE_SERVICE_ROLE_KEY` nur lokal oder in sicheren CI-Secrets verwenden, niemals im Frontend publizieren.
