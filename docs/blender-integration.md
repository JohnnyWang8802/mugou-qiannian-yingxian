# Blender model integration — October 2026

The main exhibition now uses the current Blender research candidate. The original procedural exhibition remains at `/legacy.html`; its previous Git revision is recorded in `pre-blender-integration-commit.txt`. No Blender source file was saved or overwritten by the exporter.

## Inspection

Choose **Explore** in the header. Select a storey, hide roofs or enclosure, inspect an open cutaway, and adjust the illustrative separation slider. Three detail views locate the second-storey eave brackets, inner framing, and finial. **Exhibition** returns to the full display. The interface supports Simplified Chinese, Traditional Chinese and English, including mobile layouts.

## Asset pipeline

`public/models/manifest.json` records the SHA-256 of the Blender input. Five compressed GLB assets are loaded sequentially with measured transfer progress. The loader handles both server-side gzip content encoding and raw gzip files. Geometry uses metre units, Y up, south towards +Z. Draw batches are grouped by storey, material and member category. Positions and normals are quantized; minor bevels are removed and dense meshes simplified. Blender construction locators are excluded. There are no external texture dependencies or paid modeling services.

The current export is approximately 29 MB compressed and 3.62 million triangles. This is a substantial model; mobile viewports were tested in desktop Chrome, not on physical phones. Slow devices can use the Smooth quality setting or the preserved legacy exhibition. Actual network loading time depends on the connection; local loading measurements are not internet performance claims.

## Accuracy and visual limits

This is the current research candidate, not a completed survey reconstruction. Its geometric height is about 65.92 m including base and finial. Connections, some brackets, roofing, inscriptions and ornament still contain approximations. Web PBR colours approximate the Blender procedural materials; shader texture detail and tiny bevels are not preserved. Dense tile geometry may alias at distant views. Cut surfaces are open and separation does not represent a dismantling sequence. Classification is designed for inspection, not structural semantics.

## Validation

Run the Vite server and `node scripts/verify-blender.mjs` with local Chrome installed. It exercises language switching, floor selection, roof visibility, clipping, clay, detail views, separation/reset, PNG export, download UI, narrow layouts and legacy loading. Screenshots and a machine-readable record are in `artifacts/blender-integration/`. The headless test browser failed to enable WebGL in this environment; verification used headed Chrome on macOS.

The local Chrome 154 run at a 1440×900 drawing area measured 90 orbit frames after warm-up: median 16.7 ms, 95th percentile 18.1 ms. This small sample describes this computer only. The final scene used 54 draw calls including the ground, with 3,618,696 rendered triangles. The 3840×2160 PNG was generated and visually inspected.

To regenerate web assets from the separate Blender project:

```sh
blender --background --python scripts/export-blender.py -- \
  --source /path/to/yingxian-carrier-fit-candidate.blend \
  --parameters /path/to/tower_parameters.json \
  --output public/models
```

The source `.blend` and parameter file live in the separate research project; they are not bundled with the website. Ready-to-load web assets are included. The exporter reads the source without saving it.

## Entrance staircase correction

The source candidate's closed staircase mesh had inward winding (signed volume −53.625584 m³): all 23 horizontal treads faced down. The exporter now recalculates only this object's face normals in memory, preserving vertex coordinates and absolute volume. The original `.blend` remains unchanged. The staircase construction routine in the separate Blender project was also corrected for future builds. Verification casts downward rays at all 23 tread centres against the exported single-sided GLB and checks their expected heights within 3 mm of quantization tolerance. Frontal and oblique browser close-ups are in `artifacts/staircase/`. The dimensions and step count remain the existing modeling estimates, not newly verified historical measurements.

## Tile shading correction

The web density-reduction modifier invalidated the sharp-edge map on thin ceramic shells. Compared with geometric upward-facing polygons (normal Z > 0.4), the decimated meshes had 109,612 opposing corner normals across 18 shell groups. The exporter now rebuilds a 40-degree hard-edge map and smooth normals on the evaluated topology, before gathering glTF attributes. The same check now finds zero opposing normals; all measured deviations are below 60 degrees. Geometry positions, triangle count, material colours and lighting are unchanged. Curved ceramic surfaces remain smoothly shaded; the application does not enable blanket flat shading.

`public/models/tile-normal-audit.json` records every group before and after correction. `scripts/check-roof.mjs` checks the audit, smooth material settings and browser errors, and captures daylight, dusk, clay, overview and close views in `artifacts/roof-fix/`. The source `.blend` remains unchanged. This corrects a rendering artifact; it adds no claims about historic tile dimensions or condition.
