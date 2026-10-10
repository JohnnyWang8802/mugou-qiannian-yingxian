# Exhibition interface study

Interactive comparison for the existing A Millennium in Timber project. This is an isolated design review surface, not a production replacement. The original application and Blender assets remain unchanged.

## Run

From the project root: `npm ci`, then `npm run dev -- --host 127.0.0.1`.
Open http://127.0.0.1:5173/design-review.html .

Use the bottom picker or keys 1–3 to switch directions. R resets the current direction. The canvas supports drag/pinch/wheel, arrow keys and +/−. Language, quality, orbit and image export are available in Settings. On narrow screens Archive is in Settings.

| Direction | Design decision | Tradeoff |
| --- | --- | --- |
| Quiet | Vertical Chinese title, small brand, restrained exhibition label; observation first | Construction exploration requires opening Explore |
| Atlas | Persistent architectural index and dedicated construction observation field | More reading and interface structure |
| Nocturne | Dark exhibition, ivory study model, lower title on desktop and centered mobile identity | Default clay display deemphasizes historic material colors |

## Changes and rationale

| Before | After | Why |
| --- | --- | --- |
| Large brand competes with monument title | Compact brand and distinct title placement | Restore exhibit-first hierarchy |
| Controls distributed across all edges | Observe / Explore navigation and one view toolbar | Make the task sequence understandable |
| Tall construction panel clips on short displays | Bounded scrolling panel; mobile compact control area | Keep controls reachable |
| Three mobile control rows | One view toolbar; secondary controls in dialog | Return space to the model |
| Close-up geometry obscures labels | Dedicated clipped observation field for exploration | Preserve text readability |
| No explicit sequence from whole to detail | Whole / Brackets / Frame / Finial | Give users a route into the structure |

## Validation — 2026-10-10

- Existing production build: `npm run build` passed; existing Three.js bundle-size warning remains.
- Prototype TypeScript: `npx tsc -p prototypes/exhibition/tsconfig.json` passed.
- Inspected actual rendered screenshots using Codex in-app browser: desktop 1382×835 and 1440×900; mobile viewport 390×844; narrow English 320×740. These are browser viewport checks, not physical phone tests.
- Switched all three variants; exercised construction chapter selection, floor selection, roof visibility, clay, separation, reset, language and archive dialogs.
- Repaired English navigation overlap at 320px; document scrollWidth matched viewport width.
- Exported and opened a 1920×1080 PNG. File: `artifacts/ui-redesign/12-export.png`.
- Sampled browser console after interactions: no warnings/errors returned.
- Screenshots saved under `artifacts/ui-redesign/` (04–06 desktop options; 07–11 mobile and edge cases; 13 structure mode).

## Limits and next step

The model is the existing research candidate, including its material and geometric limitations. This study does not certify archaeological accuracy or complete the paused modeling work. No new fonts, external textures, dependencies or generated architectural references were introduced.

This route is included as a separate Vite production entry at `design-review.html`, so the three directions can be reviewed online while the main exhibition stays intact. Select a direction before integrating it into the production application; then remove the comparison harness and revalidate production loading, full export options and target-device performance. Existing production functionality remains available in the unchanged main application.
