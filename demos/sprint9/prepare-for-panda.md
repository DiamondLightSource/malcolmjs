# Preparing for PANDA deployment

**Stories covered:** 271, 279, 79

## Demo

### Confirm deployment process
1. Show the repo and the commit that was tagged as `1.0.0`
1. Describe how that was pushed and travis automatically started building it. Show the build at https://travis-ci.org/dls-controls/malcolmjs/builds/430413700
1. Show the `1.0.0` release at https://github.com/dls-controls/malcolmjs/releases and show the contents of the zip.

### Remove all visible references to Malcolm
1. Show the site running, show there are no Malcolm logos present except the favicon (this will be replaced when deployed on a panda box).
1. Click on the info icon for Layout when on PANDA and show it refers to `Type ID` rather than malcolm.

### Configurable footer
1. Alter the pixel size of the footer to `200` and show the footer gets larger.
1. Set it back to `45` and update `index.html` with the contents of `panda.footer.html` before the end of the `</body>` tag.
1. Show that the PANDA footer is inserted correctly.