
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

* Die Datei _scripts/config/config.json_ anlegen mit der *spreadsheetId*
* Anleitung befolgen um die Google Spreadsheet API nutzen zu können: https://developers.google.com/sheets/api/quickstart/nodejs
  * Wichtig evtl.: Umgesetzt wurde es aktuell mit "googleapis@27"
  * Die Config Dateien credentials.json und token.js müssen kopiert werden nach _scripts/config_
* Hugo installieren: https://gohugo.io/

## Generieren der Webseite: 

    cd scripts

    # Google Spreadsheet auslesen, Markdownfiles erstellen, Screenshots erzeugen, Bildgrößen optimieren 
    npm run generate

    # HTML Seiten bauen und hochladen
    npm run build
    scp -rp docs user@server.tld:~


## Development-Server laufen lassen: 

    hugo serve

Danach kann man diese Url ausprobieren:  http://localhost:1313/posts/

Zu beachten ist, dass das nur mittel gut funktioniert und nach manchen Änderungen (Content-Dateien z.B.) der Server manuell neugestartet werden muss.


# Link-Resourcen

* Instructions for mediumish theme: https://themes.gohugo.io/mediumish-gohugo-theme/
* Hugo documentation https://gohugo.io/content-management/summaries/
* Alternativer Style: jekyll mit dem Sleek theme? https://jekyll-themes.com/sleek/  https://janczizikow.github.io/sleek/
