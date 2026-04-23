# Bellinis Next Architektur und Phasen

## Phase 1 (umgesetzt)

- React + TypeScript Frontend mit Feature-Modulen
- Supabase Data Access Layer
- Rollenbasiertes Login (`admin`, `manager`, `employee`)
- Mandantenmodell ueber `organization_id`
- SQL-Schema inkl. Constraints, Indizes und RLS
- Kernmodule: Mitarbeiter, Schichten, Wochenplan, Abwesenheiten, Auswertung, Archiv
- JSON Import/Export und Basis PDF Export

## Phase 2 (vorbereitet)

- Edge Functions fuer erweiterte Auto-Plan Optimierung
- Konflikterkennung (Ueberstunden, Ruhezeiten, Doppelbelegung)
- Benachrichtigungen (E-Mail/Push) bei Planfreigaben
- Erweiterte Reports (Monats-/Quartalsauswertung)

## Phase 3 (vorbereitet)

- Mobile App (React Native/Expo) auf identischer Supabase API
- Offline-Sync fuer mobile Nutzung
- Multi-Standort-Faehigkeit je Organisation
- Audit- und Compliance-Dashboard
