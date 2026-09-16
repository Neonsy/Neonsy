# Stack badges

The profile uses local SVG badges to preserve the logos' original colors

Run `node scripts/generate-stack.mjs` from the repository root after changing the source SVGs or `manifest.json`. The generator writes the light and dark badges used by the profile

`manifest.json` records the pinned upstream source and license for each mark. Original SVGs and Fumadocs' PNG icon are kept in `sources/`, and their license notices are in `licenses/`. Generated badges add an outline, label, and optional contrast background without changing the source paths. Simple Icons marks receive their published brand color

The logos identify their respective projects. Trademark rights remain with their owners
