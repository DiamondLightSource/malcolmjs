# Refactor URL handling

## Stories covered
1. 206 - Refactor URL handling

## Demo
1. Run `npm start`
1. Navigate to http://localhost:3000/gui/PANDA/layout/SEQ2/table/.info
1. Point out that `SEQ2` is being loaded from the `layout` attribute.
1. Point out that it has correctly chosen `SEQ2` as the parent with info in the child panel.
1. Click on `SEQ2` in the nav bar.
1. Show that it's now `PANDA`/`layout`/`SEQ2`
1. Move the `BITS` blocks, show that the url correctly goes to `PANDA/layout/BITS`
1. Click on `Layout` in the nav bar, show that the child panel collapses.
1. Click on `PANDA` in the nav bar, show that the layout disappears.