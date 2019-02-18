# Changelog
## 1.6.1 (18/2/2019)
Fixes:
- Fixed incorrect height on combobox
- Fixed bug with first edit to textbox following put not working
- Fixed bug where formatting from display_t was attempting to apply to strings
Tweaks: 
- Tweaked style of units for textinput/update
- Removed cursor styling from method input label
- Changed reconnect behaviour so resubscribe is attempted only if and when an update to .blocks containing a block's MRI is received
## 1.6.0 (4/2/2019)
Fixes:
- Attempting to delete read-only link in layout now has no effect
- Parameter names are no longer clickable
- Method flag behaviour fixed (was previously getting stuck flagged as dirty)
Features:
- TextUpdate/Inputs now display units & formatting
- Added new plotter widget for graphing table (ALPHA FEATURE)
- Changed alarm icons for methods and their parameters
- Clicking currently selected item in a comboBox now sends a fresh put for that value
Misc:
- Added new port colour for type "block"
- Current route/item is now selected in nav drop down menu is now
- Expanders for methods with parameters now start collapsed
- Various minor style tweaks

## 1.5.1 (4/12/2018)
Fixes:
- Deleting links on the layout now causes them to be properly deselected on the state (as such deleting a second link after having made a new link to the same sink port as the first was originaly linked to no longer causes the new link to be deleted)
- Fixed bug in processing returns for unpacked methods (method returns now fire a new action in the socket handler)
Misc:
- Refactored docs

## 1.5.0 (1/11/2018)
Features: 
- Added zoom buttons to the layout
- Added move row buttons to table info pane
- Updated automated screenshots for docs
Fixes:
- Block label updates now applied properly to block on layout upon receipt
- Table vertical scroll bar no longer causes horizontal scrollbar to appear/unnecessary padding on right of table

##1.4.0 (25/10/2018)
Features:
- Method input behaviour improved: non-required params only initialised and sent when user enters a value and required params are intialised to their default. 
- Added button to info pane to discard values for method input params
- Added validation of required params to method (will not post and flag missing params with warning icon when the user tries to run) 
- Added relevant messages in middle panel when nothing is displayed
- Added handling for array type attributes
- Changed combobox behaviour (now defaults to first value in choices if none specified, also will display non-selectable value if provided one is not in choices)
- Navigating to new route from popout pane now launches new full size window
- Added animation for transitioning child panel to parent
- Added acknowledge error button to info pane for attributes
- Various style tweaks
- Changed block list subscription mechanism (NOTE: this change is not backwards compatible with older versions of pymalcolm)

Fixes: 
- Fixed selected item theming in firefox
- Fixed tooltip messages (now displays description or error message only if non-zero error state)
- Re-applied fix for layout drag and drop issue (this did not actually make it into 1.3.0 due to merge issue)

##1.3.1 (15/10/2018)
Fixes:
- Prevented accidental multi-selecting of links by clicking the middle of a hidden link (the port on a hidden link is no longer clickable).
## 1.3.0 (15/10/2018)
Features: 
- Hidden links are now clickable/selectable/deletable in the same way normal links are.
- Added saved configuration for generating canned data from PandA simulator
- Minor style tweaks

Fixes: 
- Errors from malcolm regarding the layout attribute no longer overwrite the subscription ID and cause a crash.
- Orphaned attributes now get hidden as soon as the block meta is updated to orphan them (n.b. this bug still exists for orphaned group expanders).
- Selected blocks/links state now reset properly when swapping between multiple layout attributes.
- Navigating to a layout via the nav bar now fires the necessary subscription requests.
- Highlighting text and dragging & dropping onto the layout no longer causes a crash.

## 1.2.0 (8/10/2018)
Features:
- Table widget swapped for react-virtualized based component for improved performance and styling
- migrated to material-UI v3
- refactored malcolm reducer code
- added some (non-trivial) end-to-end tests

Fixes:
- Block not found warning once again displayed in parent pane
- Behaviour when part of url is invalid improved
- No longer errors when establishing initial connection in case where site was opened before malcolm server started
- textInput state now consistent and preserved between parent and child pane
- fixed automated screenshot script
- Various style tweaks/fixes

 
## 1.1.0 (20/9/2018)
Features:
- Improved the drop zone around ports on the layout view
- Added a drop zone highlight around ports when making a link

Fixes:
- Blocks now appear as loading when waiting for attributes to load

## 1.0.0 (19/9/2018)
Initial release for MalcolmJS that can be deployed to a PANDA box.
