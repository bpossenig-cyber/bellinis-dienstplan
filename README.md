# Bellinis Dienstplan PWA

Progressive Web App für die Schichtplanung im Bellinis Restaurant.

**Restaurant:** Sparkassenplatz 2, 6020 Innsbruck  
**Telefon:** +43 699 12268051  
**Email:** office@judys-bellinis.at

## 🚀 Features

- ✅ **Offline-fähig** — funktioniert ohne Internet nach erstem Laden
- ✅ **Mobile & Desktop** — responsive für alle Geräte
- ✅ **3 Schichten pro Tag** — Früh 1, Früh 2, Spät
- ✅ **Auto-Planer** — KI-gestützte Schichtplanung mit Fairness-Algorithmus
- ✅ **Mitarbeiterverwaltung** — Sollstunden, Verfügbarkeit, Schichtsperren
- ✅ **Archiv** — Wochenauswertungen mit PDF-Export
- ✅ **PWA** — installierbar als App auf Handy und Desktop

## 📁 Dateistruktur

```
bellinis-deploy/
├── index.html          # Haupt-App (3200+ Zeilen, komplette Logik)
├── manifest.json       # PWA Manifest
├── sw.js              # Service Worker (Offline-Cache)
├── icon-192.png       # App-Icon 192x192
├── icon-512.png       # App-Icon 512x512
├── README.md          # Diese Datei
└── .gitignore         # Git-Ausschlüsse
```

## 🌐 Deployment

### GitHub Pages (kostenlos)

1. **Repo erstellen:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/DEIN-USERNAME/bellinis.git
   git push -u origin main
   ```

2. **GitHub Pages aktivieren:**
   - Gehe zu: `Settings` → `Pages`
   - Source: `Deploy from a branch`
   - Branch: `main` / `root`
   - Save

3. **URL:**  
   `https://DEIN-USERNAME.github.io/bellinis/`

### Netlify (kostenlos)

**Option A: Netlify Drop**
1. Gehe zu https://app.netlify.com/drop
2. Ziehe den `bellinis-deploy` Ordner ins Fenster
3. Fertig! URL: `https://ZUFAELLIGER-NAME.netlify.app`

**Option B: Netlify CLI**
```bash
npm install -g netlify-cli
cd bellinis-deploy
netlify deploy --prod
```

### Vercel (kostenlos)

```bash
npm install -g vercel
cd bellinis-deploy
vercel --prod
```

## 📱 Installation auf dem Handy

### Android (Chrome)
1. Öffne die gehostete URL in Chrome
2. Tippe auf Menü (⋮) → **"Zum Startbildschirm hinzufügen"**
3. ✅ App ist installiert!

### iPhone (Safari)
1. Öffne die gehostete URL in Safari
2. Tippe auf Teilen-Icon (⬆️)
3. Scrolle runter → **"Zum Home-Bildschirm"**
4. ✅ App ist installiert!

## 🔧 Lokale Entwicklung

```bash
# Einfach einen lokalen Server starten
npx serve .

# Oder mit Python
python3 -m http.server 8000

# Oder mit Node.js
npx http-server
```

Dann öffne: http://localhost:8000

## 💾 Daten-Persistenz

Alle Daten werden lokal im Browser gespeichert:

- **localStorage** — aktuelle Woche, Mitarbeiter, Einstellungen
- **Kein Backend** — 100% offline, keine Datenbank nötig
- **Export** — PDF, CSV, JSON für Backups

## 📊 Funktionen im Detail

### Wochenplanung
- Mo–Sa, 3 Schichten/Tag
- Dynamische Slots (mehrere MA pro Schicht)
- Doppelschicht-Warnung
- Schichtsperren pro Mitarbeiter

### Auto-Planer
- 600 Iterationen für optimale Planung
- Fairness-Algorithmus (gerechte Spätdienst-Verteilung)
- Berücksichtigt: Sollstunden, Max. Arbeitstage, Verfügbarkeit
- Adaptive Toleranz bei Personalausfällen

### Mitarbeiterverwaltung
- Name, Sollstunden, Max. Arbeitstage
- Status: Verfügbar / Urlaub / Krankenstand
- Schichtsperren: Früh 1, Früh 2, Spät (unabhängig)
- Gesperrte Wochentage (Mo–Sa)

### Auswertung
- Wochenübersicht mit Stunden pro MA
- Zeitraum-Auswertung (mehrere Wochen)
- PDF-Export mit Detailübersicht
- Archiv (bis zu 104 Wochen)

## 🎨 Design

- **Farbschema:** Salbeigrün (#acc8b2), Orange (#c8450a), Dunkelbraun (#1a1208)
- **Fonts:** Playfair Display (Headlines), DM Sans (Body)
- **Mobile-First:** Responsive ab 380px
- **Grain-Texture:** Subtile Hintergrund-Textur

## 🔐 Sicherheit

- Keine externen Abhängigkeiten (außer CDN-Fonts)
- Keine Cookies, keine Tracking
- Alle Daten bleiben lokal im Browser
- HTTPS-only (über GitHub Pages / Netlify)

## 📝 Lizenz

Proprietäre Software für Bellinis Restaurant.  
© 2026 Bellinis, Innsbruck

## 🆘 Support

Bei Fragen oder Problemen:
- Email: office@judys-bellinis.at
- Tel: +43 699 12268051
