# MalcolmJS Navigation Bar

Stories covered:
- 87 - hook up changing the dropdowns to change the url
- 86 - use the current url to fill out the nav bar
- 85 - make a control for the nav bar
- 28 - add a top level nav bar component

## Demo

1. Run `npm start` and navigate to http://localhost:3000/gui/
1. Show that you can select a root node, select PANDA from the list
1. Show that the parent details get populated
1. Navigate to http://localhost:3000/gui/PANDA/layout and show the middle panel gets populated
1. Click on PANDA to show that the nav items are also links.
1. Navigate to http://localhost:3000/gui/PANDA/layout/PANDA:CLOCKS and show the child panel also gets populated
1. Choose a different child and show the child panel is updated, navigate back to the PANDA:CLOCKS child block and show it is an instantaneous load - the block is still being subscribed to.