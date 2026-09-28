# Ograaa | أجرة
**Designed & developed by Hossam Hegazi**

Egyptian microbus, bus and coach driving simulator for the browser (PC, tablet, phone · Arabic & English).

## Project structure
```
index.html              ← game shell (markup only)
css/ograaa.css          ← all styles
js/assets.js            ← asset manifest + sprite metadata (wheel hubs, lamp positions, walk cycles)
js/core.js              ← data, economy, i18n, saves, audio engine
js/physics.js           ← terrain + vehicle physics (suspension, gearbox, ABS/TC)
js/renderer.js          ← images, vehicle canvases, cosmetics
js/world.js             ← base world drawing, particles, gauges
js/gameplay.js          ← trips, stops, police, traffic lights, economy
js/realism.js           ← sky, streets, lights, damage, smart AI, radio, ambience
js/ui.js                ← menus, HUD, input, main loop
js/cockpit.js           ← cockpit panels (radio, A/C, cruise)
js/dmv-profile.js       ← DMV, licences, profile, settings, stop markers
js/streets.js           ← panoramas, building placement, tolls
js/services.js          ← trunk storage, cafés, fuel stations, workshops
js/premium.js           ← window passengers, fire & debris, fatigue, market, dev mode, anti-cheat
js/polish.js            ← dynamic cabin, coloured service bays, calm sounds, LCD alignment
assets/img/             ← optimised WebP sprites (vehicles, buildings, props, people, UI)
assets/audio/           ← menu music
play-offline.html       ← single-file build for double-click offline play
manifest.webmanifest    ← install as an app (PWA)
```

## Publish on GitHub Pages
1. Create a repository and upload **everything inside this folder** (keep the folders).
2. Settings → Pages → *Deploy from a branch* → `main` / `(root)` → Save.
3. Play at `https://<username>.github.io/<repository>/`.

> The folder version must be served over http(s) (GitHub Pages, Netlify, or `python -m http.server` locally). To play by double-clicking, open **play-offline.html**.

## Notes
- Live radio (11 Egyptian stations via Radio Garden) works on GitHub Pages and locally; the claude.ai preview blocks outside audio.
- Saves are encrypted and signed in local storage. Tampering restores the last clean save and triggers a one-hour ban (developers excepted).
