# Roof shimmer correction — 2026-10-10

The design-review renderer now requests Three.js r180 reverse depth (`EXT_clip_control`, capability-gated) and updates near/far planes to match the orbit distance. The standard-depth fallback also uses the tighter clipping range. Detailed rendering uses 1.5–2× pixel density (mobile capped at 1.5×); Smooth remains 1×. Export renderer inherits the interactive renderer's depth mode to avoid a mismatched reversed projection.

Read-only ray sampling of the existing fourth-storey GLB found 14 of 497 roof sample rays with two intersections less than 1 mm apart, minimum 0.13748 mm. Upward-facing-surface-only sampling found no exact coincident layers in that sample. This supports a close-depth precision risk but does not prove all speckles have one cause; subpixel tile edges also contribute. Reproduce with `node scripts/audit-roof-depth.mjs`.

Validation: live in-app browser reported reverse depth active; zoomed camera, rotated through multiple angles using actual pointer drags, inspected screenshots and checked Smooth/Detailed switching. Obvious speckles were reduced in this environment. No browser warnings/errors returned. TypeScript and the production build passed; existing bundle size warning remains. Unsupported-extension hardware and physical phones were not tested.

No GLB or Blender geometry was changed. The fixes are local and have not been deployed.

Screenshots: `speckles-before.png`, `speckles-after-rotation.png`. These are visual inspection records, not a pixel-matched temporal benchmark.
