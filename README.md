# Decibelmeter

Een installeerbare web-app (PWA) die groen, oranje of rood kleurt op basis van het geluidsniveau in dB.
Alles gebeurt op het toestel zelf: er wordt niets opgenomen of verstuurd.

- `index.html`: de volledige app (HTML, CSS en JavaScript)
- `manifest.webmanifest`: naam, kleuren en iconen voor de installatie
- `sw.js`: service worker, zodat de app ook offline opstart
- `icons/`: app-iconen, gemaakt met `tools/maak_iconen.py` (vereist Pillow)

Gratis aangeboden door Schildermans AI. Repetitieve taken sneller afhandelen met AI? Mail naar schildermansai@gmail.com.

## Waarom hosten via HTTPS?

De microfoon en de service worker werken alleen via `https://` (of lokaal via `http://localhost`).
Rechtstreeks openen als bestand (`file://`) werkt dus niet. Alle paden zijn relatief, zodat de app ook in een submap draait,
bijvoorbeeld `https://gebruikersnaam.github.io/decibelmeter/`.

## Gratis hosten op GitHub Pages

1. Maak op GitHub een (openbare) repository aan, bijvoorbeeld `decibelmeter`.
2. Zet de bestanden erin (vanuit deze map):
   ```bash
   git add .
   git commit -m "Decibelmeter als PWA"
   git push
   ```
3. Ga op GitHub naar **Settings > Pages**.
4. Kies bij **Source** voor **Deploy from a branch**, kies de branch `main` en de map `/ (root)`, en klik op **Save**.
5. Na een minuutje staat de app op `https://gebruikersnaam.github.io/decibelmeter/`.

## Of: gratis hosten op Netlify

1. Ga naar [app.netlify.com/drop](https://app.netlify.com/drop).
2. Sleep deze map in het venster.
3. Netlify geeft je meteen een `https://…netlify.app`-adres.

## Een nieuwe versie online zetten

De service worker bewaart de app in een cache. Pas je iets aan, verhoog dan het versienummer bovenaan in `sw.js`
(bv. `decibelmeter-v1` naar `decibelmeter-v2`). Anders blijven geïnstalleerde toestellen de oude versie tonen.
Na een update krijg je de nieuwe versie bij de tweede keer dat je de app opent.

## Lokaal testen

```bash
python -m http.server 8000
```

Open daarna `http://localhost:8000/` in Chrome. Met `http://localhost:8000/#demo` speelt de app een demosignaal af
zonder microfoon.

## Installeren op je gsm

- **Android (Chrome):** open de link, tik op het menu (⋮) en kies **App installeren** (of **Toevoegen aan startscherm**).
- **iPhone (Safari):** open de link, tik op **Deel** (vierkant met pijl) en kies **Zet op beginscherm**.
