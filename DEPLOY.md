# 🚀 Deployment-Anleitung für GitHub

## Schritt-für-Schritt: GitHub Pages

### 1. Repository erstellen

1. Gehe zu https://github.com/new
2. Repository-Name: `bellinis-dienstplan` (oder anderer Name)
3. Sichtbarkeit: **Public** (für GitHub Pages kostenlos)
4. **KEINE** README, .gitignore oder Lizenz hinzufügen (haben wir schon)
5. Klick **"Create repository"**

### 2. Dateien hochladen

**Terminal öffnen** und im `bellinis-deploy` Ordner:

```bash
# Git initialisieren
git init

# Alle Dateien hinzufügen
git add .

# Ersten Commit erstellen
git commit -m "Initial commit: Bellinis Dienstplan PWA"

# Main Branch umbenennen (falls nötig)
git branch -M main

# Remote Repository verknüpfen (ersetze DEIN-USERNAME und REPO-NAME)
git remote add origin https://github.com/DEIN-USERNAME/REPO-NAME.git

# Hochladen
git push -u origin main
```

**Oder: GitHub Desktop verwenden**
1. Öffne GitHub Desktop
2. `File` → `Add Local Repository` → Wähle `bellinis-deploy` Ordner
3. Klick `Publish repository`
4. Fertig!

### 3. GitHub Pages aktivieren

1. Gehe zu deinem Repository auf GitHub
2. Klick **Settings** (oben rechts)
3. Scrolle zu **Pages** (linke Sidebar)
4. Under **Source**:
   - Branch: `main`
   - Folder: `/ (root)`
5. Klick **Save**

⏱️ **Warte 1–2 Minuten** — GitHub baut die Seite

### 4. URL prüfen

Deine App ist jetzt live unter:
```
https://DEIN-USERNAME.github.io/REPO-NAME/
```

Beispiel: `https://judys-bellinis.github.io/dienstplan/`

### 5. App auf dem Handy installieren

**Android:**
1. Öffne die URL in Chrome
2. Menü (⋮) → "Zum Startbildschirm hinzufügen"

**iPhone:**
1. Öffne die URL in Safari
2. Teilen (⬆️) → "Zum Home-Bildschirm"

---

## ⚡ Schnell-Updates pushen

Nach Änderungen an `index.html`:

```bash
git add .
git commit -m "Update: [beschreibe Änderung]"
git push
```

GitHub Pages aktualisiert automatisch in 1–2 Minuten.

---

## 🌐 Eigene Domain verbinden (optional)

### Bei GitHub Pages:

1. Repository → Settings → Pages
2. **Custom domain** → Trage deine Domain ein (z.B. `dienstplan.bellinis.at`)
3. **Enforce HTTPS** aktivieren

### Bei deinem Domain-Provider:

Erstelle einen **CNAME Record**:
```
dienstplan  →  DEIN-USERNAME.github.io
```

Oder **A Records** (wenn Root-Domain):
```
@  →  185.199.108.153
@  →  185.199.109.153
@  →  185.199.110.153
@  →  185.199.111.153
```

⏱️ **Warte 24h** für DNS-Propagierung

---

## 🔧 Troubleshooting

### "404 Page not found"
- Warte 2–3 Minuten nach dem ersten Push
- Prüfe: Settings → Pages → Source ist korrekt?
- Branch muss `main` heißen (nicht `master`)

### Icons werden nicht angezeigt
- Stelle sicher dass `icon-192.png` und `icon-512.png` im Root liegen
- Hard-Reload: `Ctrl+Shift+R` (Windows) oder `Cmd+Shift+R` (Mac)

### App installiert sich nicht
- Muss über **HTTPS** laufen (GitHub Pages macht das automatisch)
- Chrome/Safari muss aktuell sein
- Bei iOS: muss Safari sein, nicht Chrome

### Änderungen erscheinen nicht
- GitHub Pages cached aggressiv
- Warte 2–5 Minuten
- Hard-Reload im Browser
- Oder: Inkognito-Fenster öffnen

---

## 📊 GitHub Pages Status checken

Repository → **Actions** Tab → siehst du den Build-Status

Grüner Haken ✅ = live  
Roter X ❌ = Fehler beim Build (check Logs)

---

## ✅ Fertig!

Deine App läuft jetzt:
- **Kostenlos** auf GitHub
- **Automatische Updates** bei jedem Push
- **HTTPS** inklusive
- **Unbegrenzt Traffic**

Bei Fragen: office@judys-bellinis.at
