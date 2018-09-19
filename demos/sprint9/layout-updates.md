# Layout Updates

**Stories covered:** 332, 326, 303, 327, 328

## Demo
### Fix layout center and zoom

1. Go to http://localhost:3000/gui/PANDA/layout
1. Move the layout so the center is different and zoom out.
1. Click on a block to open the child panel.
1. Show that the layout has stayed in the same place and at the same zoom level.

### Fix horizontal scrollbar appearing on layout

1. Go to http://localhost:3000/gui/PANDA/layout
1. Repeatedly click on blocks and close the child panel
1. Show that there is now no horizontal scrollbar where one use to appear.
1. Describe how we couldn't find the cause but instead simply disabled the horizontal scroll in the css.

### Disallow dangling links

1. Go to http://localhost:3000/gui/PANDA/layout
1. Try to create a link from a source port to nowhere
1. Show it immediately disappear.

### Link doesn't stay selected

1. Go to http://localhost:3000/gui/PANDA/layout
1. Click on a link and show it stays selected.
1. Describe how this was because we went tracking selected links so the state was lost when it re-rendered when the child panel opened.

### Layout optimistic updates

1. Make the dev server delay `3000`ms in order to see responses loading.
1. Go to http://localhost:3000/gui/PANDA/layout.
1. See blocks loading
1. Click on TTLOUT1 and go to it's label attribute.
1. Delete the contents of the label (this would have previously deleted the block)
1. Show the block going back to a loading state
1. Delete a block and show it is instantaneous now.

