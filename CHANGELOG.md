# Changelog
## 1.2.0 (8/10/2018)
Features:
- Table widget swapped for react-virtualized based component for improved performance and styling
- migrated to material-UI v3
- refactored malcolm reducer code
- added some (non-trivial) end-to-end tests

Fixes:
- Block not found warning once again displayed in parent pane
- Behaviour when part of url is invalid improved
- No longer errors when establishing initial connection in case where site was openend before malcolm server started
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
