# Layout updates

## Stories covered
1. #129 - Update block position on the server
1. #128 - Fix links so they start from the port
1. #130 - Make custom links that connect a block to itself
1. #133 - Add existing links for blocks

## Demo
### Part 1
1. Run `npm run storybook` and navigate to http://localhost:9009/?selectedKind=Layout%2Fblock&selectedStory=multiple%20blocks&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybook%2Factions%2Factions-panel
1. Show that links start from the port now.
1. Show that a block can connect to itself.
1. Show the extra curvature added when the target block is behind.
1. Show that way-points can be added and the continuous spline through them will be calculated.
1. Point out that this is currently not available in the main interface because we don't store the waypoints yet. We also can't make new connections yet.
-----------

### Part 2
1. Run `npm start` and navigate to http://localhost:3000/gui/PANDA/layout/PANDA:CLOCKS
1. Point out that there are existing links from the data added to the blocks.
1. Move the blocks so all the connections can be seen.
1. Open the developer console, clear all the messages.
1. Move a block and then talk through the stream of events. Particularly point out the PUT operation.
1. Show how clicking on a block brings it up in the child window and updates the nav
1. Show multi-select using the shift key and then move all the blocks.
1. Show the alarm status in the top left as the position is being updated.
1. Copy line 107 in `test-malcolm-server.js` and replace lines 104 and 105 with it, this will simulate an error being returned for a position update.
1. Go back to the interface and move a block, show that the UI does an optimistic update and then snaps back when it received the error.