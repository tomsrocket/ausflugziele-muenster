#!/bin/bash

echo Google Spreadsheet auslesen, Markdownfiles erstellen, Screenshots erzeugen
npm run generate

echo Bildgrößen optimieren bzw. Thumbnails erstellen
npm run thumbnails

echo Statische HTML-Seiten generieren
npm run build

echo Statische Seiten auf Server hochladen
npm run deploy

