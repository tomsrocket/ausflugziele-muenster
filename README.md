
# Quellcode zum Familien-Kompass Münster

Adresse:
    https://www.familien-muenster.de

## Hintergrund

Ich hatte schon länger die Idee, eine Webseite für Familien in Münster zu machen. Hauptsächlich wegen Eigenbedarf: Zuerst fehlten uns Infos zu Wickelplätzen in der Innenstadt, später war dann eher wichtig, wo kann man gut mit kleinen Kindern essen gehen, und zuletzt: Was können wir mit den Kindern an verregneten Wochenenden unternehmen?

Es sollte also am besten ein Nachschlagwerk sein, das Links zu verschiedenen familienrelevanten Themengebieten enthält.

Nachdem ich an der Umsetzung von zwei anderen Projekten beteiligt war (mein-ms.de, spassmitdaten.de) kam mir dann der Geistesblitz, wie ich es am einfachsten umsetzen kann:
 * Ein Google-Spreadsheet, das die Links enthält
 * Ein Skript, das das Google-Spreadsheet ausliest, und daraus Markdown-Dateien erstellt
 * Ein Website-Generator, der daraus eine statische Webseite erstellt

Für letzteren Punkt kam sehr vieles in Frage, ich habe mich letztendlich für "Hugo" entschieden.

## TL;DR

Dieses Repository generiert meine Familien-Unternehmungen-Seite ("familien-muenster.de") aus einem Google Spreadsheet.


# Entwicklungs-Anleitung

## Setup

* Die Datei _scripts/config/config.json_ anlegen mit der *spreadsheetCsvUrl*
* Falls man auch deployen will, dann auch die _scripts/config/config.deploy.sh_ anlegen
* Hugo installieren: https://gohugo.io/ bzy. _sudo apt install hugo_

## Generieren der Webseite

Hinweis: Wenn man *"npm run generate"* aufruft, werden nach und nach alle Screenshots erstellt. Dabei poppt immer ein Browserfenster auf, in dem man **den Cookiehinweis wegklicken kann**, wenn man schnell genug ist. Fünf Sekunden Zeit hat man, theoretisch kann man sich auch noch weiter durchklicken oder zum Ausschnitt scrollen, den man gern auf dem Screenshot haben möchte.

```bash
    # Ins Unterverzeichnis "scripts" wechseln
    cd scripts

    # Google Spreadsheet auslesen, Markdownfiles erstellen, Screenshots erzeugen
    npm run generate

    # Bildgrößen optimieren bzw. Thumbnails erstellen
    npm run thumbnails

    # Statische HTML-Seiten generieren
    npm run build

    # Statische Seiten auf Server hochladen
    npm run deploy
```

## Development-Server laufen lassen:

```bash
    hugo serve
```

Danach kann man diese Url ausprobieren:  http://localhost:1313/

Zu beachten ist, dass das nur mittel gut funktioniert und nach manchen Änderungen (Content-Dateien z.B.) der Server manuell neugestartet werden muss.

## How does it work

Das Skript *read-public-google-spreadsheet.js*, das man mit `npm run generate` laufen lassen kann, tut folgendes:

* CSV-Datei downloaden von der Url die in `config.json` hinterlegt ist
* Für jede Zeile aus der CSV wird eine Markdown-Datei angelegt im Verzeichnis `/content/posts`
* Bildschirmfotos der URLs (Spalte 2) erzeugen und ablegen in `/static/images/posts`
* Dann kann man mit `npm run thumbails` die Thumbnails generieren, die werden dann auch unter /static/images abgelegt.

# Link-Resourcen

* Instructions for mediumish theme: https://themes.gohugo.io/mediumish-gohugo-theme/
* Hugo documentation https://gohugo.io/content-management/summaries/
* Alternativer Style: jekyll mit dem Sleek theme? https://jekyll-themes.com/sleek/  https://janczizikow.github.io/sleek/
