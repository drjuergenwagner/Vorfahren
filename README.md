# Einfache Ahnenverwaltung

Eine kleine, statische Ahnenverwaltung für GitHub Pages.

## Start

Die Anwendung benötigt keinen Server:
1. Dateien in ein GitHub-Repository hochladen.
2. Unter **Settings → Pages** als Quelle `Deploy from a branch` wählen.
3. Branch `main` und Ordner `/ (root)` auswählen.
4. Die erzeugte GitHub-Pages-Adresse öffnen.

Die Beispieldaten liegen in `data.json`.

## Datenmodell

- `persons`: Personen
- `relationships`: Eltern-Kind-Beziehungen
- `sources`: Quellen zu Personen oder Beziehungen
- `places`: optionale Ortsdaten

Für einen einfachen Start wird nur `persons` und `relationships` in der Oberfläche verwendet.
