# Ograaa | أجرة
**Designed & developed by Hossam Hegazi**

Egyptian microbus, bus and coach driving simulator for the browser (PC, tablet, phone · Arabic & English).

## Project structure (17 files + this README)
```
index.html                 ← game shell (markup only)
manifest.webmanifest       ← install as an app (PWA)
play-offline.html          ← single-file build for double-click offline play
css/ograaa.css             ← all styles
js/assets.js               ← asset manifest: atlas rectangles, audio-sprite timings, sprite metadata
js/ograaa.js               ← the whole game (modules concatenated in load order, each section labelled)
assets/img/vehicles.webp   ← player & AI vehicles + wheels (atlas)
assets/img/people.webp     ← pedestrians & passengers walk cycles (atlas)
assets/img/officer.webp    ← traffic officer animation sets (atlas)
assets/img/buildings.webp  ← street buildings, shops, services (atlas)
assets/img/skyline.webp    ← city / coast / desert panoramas (atlas)
assets/img/world.webp      ← props, road textures, dashboard parts (atlas)
assets/img/ui.webp         ← menu icons (atlas)
assets/img/bg.jpg, logo.webp
assets/audio/menu-night.mp3
assets/audio/sfx.mp3       ← horns, sirens, street ambience & rain in one audio sprite
```

## Publish on GitHub Pages
1. Create a repository and upload **everything inside this folder** (keep the folders).
2. Settings → Pages → *Deploy from a branch* → `main` / `(root)` → Save.
3. Play at `https://<username>.github.io/<repository>/`.

> The folder version must be served over http(s) (GitHub Pages, Netlify, or `python -m http.server` locally). To play by double-clicking, open **play-offline.html**.

## Notes
- Live radio (11 Egyptian stations via Radio Garden) works on GitHub Pages and locally; the claude.ai preview blocks outside audio.
- Saves are encrypted and signed in local storage. Tampering restores the last clean save and triggers a one-hour ban (developers excepted).
