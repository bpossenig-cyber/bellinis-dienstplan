# Bellinis Next - Phase 1 Fundament

Professionelle Neuentwicklung der Bellinis-Dienstplan-App mit React + TypeScript + Supabase.

## Zielbild

- Multi-Device Datenhaltung mit zentraler PostgreSQL-Datenbank
- Rollenbasiertes Login (`admin`, `manager`, `employee`)
- Mandantenfaehige Architektur ueber `organization_id`
- Produktionsnahes Frontend-Fundament fuer Phase 1
- Vorbereitet fuer Phase 2/3 (mehr Automatisierung, mobile Erweiterung, erweiterte Reports)

## Architektur

- Frontend: Vite + React + TypeScript
- Backend/API/Auth/DB: Supabase (PostgreSQL, Auth, RLS)
- Deploy Frontend: Vercel oder Netlify
- Optional: Supabase Edge Functions fuer Speziallogik

## Ordnerstruktur

```text
src/
  app/providers/            # Auth Provider + App Setup
  features/                 # Fachmodule je Funktionsbereich
    auth/
    staff/
    shifts/
    plans/
    absences/
    reports/
    archive/
    transfer/
  lib/
    api/                    # Supabase Data Access Layer
    planning/               # Auto-Plan Kernlogik
    types.ts                # Domaintypen
supabase/migrations/        # SQL Schema + RLS Policies
```

## Implementierter Phase-1 Umfang

- Mitarbeiterverwaltung
- Schichtverwaltung
- Wochenplan speichern/laden
- Urlaub, Krankenstand und Feiertage
- Auto-Plan nur fuer Kern-Team
- Grundauswertung und PDF-Export
- Archivierung von Wochenplaenen
- JSON-Import/Export fuer Migration aus Altbestand

## Setup

1. Abhaengigkeiten installieren:

```bash
npm install
```

2. Umgebungsvariablen setzen:

```bash
cp .env.example .env
```

Dann in `.env` Werte setzen:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

3. Supabase Migration ausfuehren:

```bash
supabase db push
```

4. Erst-Onboarding (Organisation + erster Admin):

```bash
npm run onboard:admin
```

5. Dev-Server starten:

```bash
npm run dev
```

## Tests

```bash
npm run test
```

Enthaelt Basistests fuer kritische Kernlogik (`Auto-Plan`).

## Deployment (Empfehlung)

1. Projekt bei Supabase anlegen, Auth + DB konfigurieren, Migration ausrollen.
2. Frontend auf Netlify deployen (GitHub verbunden):
   - `netlify.toml` ist bereits enthalten
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Env Vars aus `.env` im Projekt hinterlegen (`VITE_*`)

3. Alternative: Frontend auf Vercel deployen:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Env Vars aus `.env` im Projekt hinterlegen.
4. Domain + HTTPS aktivieren.

## Rollen und Sicherheit

Das Datenmodell verwendet RLS Policies. Jeder Nutzer sieht nur Daten seiner Organisation.

- `employee`: nur Leserechte in eigener Organisation
- `manager`: Lesen/Schreiben auf operative Planungsdaten
- `admin`: Vollzugriff auf operative Planungsdaten und Auswertung

## Migration Altdaten

Der Import akzeptiert eine JSON-Datei mit den Bereichen:

- `staff`
- `shifts`
- `vacation_blocks`
- `sick_blocks`
- `holidays`

Empfehlung: zuerst Stammdaten (Mitarbeiter/Schichten), dann Abwesenheiten, danach Wochenplaene.
