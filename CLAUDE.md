# Bellinis Dienstplan — Claude Code Kontext

## Projektübersicht

PWA (Progressive Web App) für die Schichtplanung im Bellinis Restaurant Innsbruck.

- **Lokaler Pfad:** `G:\Bellinis\Deployed\bellinis-deploy\index.html`
- **GitHub Repo:** https://github.com/bpossenig-cyber/bellinis-dienstplan
- **Live-URL:** https://bpossenig-cyber.github.io/bellinis-dienstplan/
- **Git User:** bpossenig-cyber

## Tech-Stack

- **Single-File HTML/CSS/JavaScript** — keine Frameworks, kein Build-Prozess
- **localStorage** für Persistenz (Keys: `bellinis-planer-app-v2`, `bellinis-planer-staff-v1`, `bellinis-planer-archiv-v2`)
- **PWA:** manifest.json + sw.js (Service Worker für Offline-Support)
- **Hosting:** GitHub Pages

## Dateistruktur

```
bellinis-deploy/
├── index.html      # Haupt-App (3200+ Zeilen, komplette Logik inline)
├── manifest.json   # PWA Manifest — NICHT ohne Abfrage ändern
├── sw.js           # Service Worker — NICHT ohne Abfrage ändern
├── icon-192.png    # App-Icon — NICHT ohne Abfrage ändern
├── icon-512.png    # App-Icon — NICHT ohne Abfrage ändern
├── CLAUDE.md       # Diese Datei
└── README.md
```

## App-Struktur (4 Tabs)

1. **Wochenplan** — Mo–Sa, 3 Schichten pro Tag:
   - Früh 1: 07:00–15:00
   - Früh 2: 09:00–18:00
   - Spät: 15:00–22:00
   Pro Schicht mehrere Mitarbeiter möglich (dynamische Slots)

2. **Mitarbeiter** — Stammdaten + Urlaub/Krankenstand mit 2-Monats-Kalender-Modal

3. **Auswertung** — Statistiken über eingeplante Stunden pro Mitarbeiter

4. **Archiv** — Gespeicherte Wochenpläne (bis 104 Wochen)

## Design-System

```css
--bg: #eef4f0
--card: #f7fbf8
--border: #c4d9cb
--accent: #c8450a   /* Orange */
--dark: #1a1208
```

- Fonts: **Playfair Display** (Headlines), **DM Sans** (Body)
- Mobile-First: `@media (max-width: 640px)` für Smartphone
- Mobile Schicht-Tab-System (Früh 1 / Früh 2 / Spät als Grid-Tabs)

## Datenstruktur: Mitarbeiter-Objekt

```javascript
{
  id: number,
  name: string,
  targetHours: number,      // Sollstunden pro Woche
  maxDays: number,          // Max. Arbeitstage pro Woche
  notes: string,            // Freitext (z.B. "Nur Frühdienst")
  status: 'verfuegbar' | 'urlaub' | 'krankenstand',
  blockedDays: string[],    // Geblockte Wochentage
  noFrueh1: boolean,
  noFrueh2: boolean,
  noSpaet: boolean,
  vacationBlocks: [
    { startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', days: number, dates: string[] }
  ],
  sickBlocks: [
    { startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', days: number, dates: string[] }
  ]
}
```

## Features (aktuell implementiert)

- **Auto-Plan-Generator:** 600 Iterationen, Fairness-Algorithmus, berücksichtigt Sollstunden / Max-Tage / Notizen (z.B. "Nur Frühdienst")
- **Urlaubsblöcke:** 2-Monats-Kalender-Modal mit Touch-Swipe und Pfeil-Navigation, beliebig viele Blöcke pro MA
- **PDF-Export, CSV-Export, JSON-Backup**
- **Autosave** bei jeder Änderung
- **Live-Datum-Wechsel** mit Reset-Dialog

## Pflichtregeln für Änderungen

- **KEINE** Änderungen an `manifest.json`, `sw.js` oder Icons ohne explizite Nachfrage
- **Mobile-Ansicht (≤640px)** muss nach jeder Änderung funktionieren
- **Autosave-Logik beibehalten:** `autosave()` nach jeder State-Änderung aufrufen
- **Daten-Migrations-Kompatibilität:** Neue Felder im Mitarbeiter-Objekt mit Fallback-Werten initialisieren (`if (!member.xxx) member.xxx = []`)
- **Alles in einer einzigen `index.html`** — kein externes JS/CSS
- **Kommentare und deutschen Text beibehalten**

## Workflow für Änderungen

1. `index.html` lesen und Code-Struktur verstehen
2. Feature implementieren (alles inline in `index.html`)
3. Lokal testen: `npx serve .` → http://localhost:8000
4. Nach erfolgreichem Test: `git add index.html`, `git commit`, `git push origin main`
5. Deployment erfolgt automatisch via GitHub Pages

## Lokale Entwicklung

```bash
# Lokalen Server starten (aus bellinis-deploy Ordner)
npx serve .
# oder
python3 -m http.server 8000
```
