# Layout updates

## Hidden links
1. Start the site and navigate to http://localhost:3000/gui/PANDA/layout
1. Drag the `INENC1` block to the bin to hide it
1. Show that the link now appears in the hidden style
    > Note the exact styling still needs to be updated
1. Click on the `TTLOUT1` block and in the attributes panel change the input `Val` to `ONE` in the drop down.
1. Show that the link is now still hidden but is linked to a non-existent block.

## Spline handling
1. Set the `Val` input back to `INENC1.a` and make the `INENC1` block visible from the palette.
1. Drag the `TTLOUT1` block around to the right of the `INENC1` block and show that the spline always sticks out horizontally from the source and sink ports.
1. Drag the `TTLOUT1` block to the left of the `INENC1` block till you get a loop back spline.
1. Show now that the hover over and selection for the spline is only close to the line.
1. Describe that this is because the spline is now made up of much smaller sections that fit the old spline.


## Multi-select blocks
1. Shift select both the `INENC1` and the `TTLOUT1` block.
1. Drag them around by clicking and dragging on one of the blocks.
1. Show that the link now moves with it.

