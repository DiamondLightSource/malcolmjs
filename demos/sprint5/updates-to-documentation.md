# Updates to documentation

## Stories covered
1. 193 - Document the code structure
1. 197 - Start the user guide
1. 186 - Update documentation to mention node 8.5
1. 194 - Document the testing strategy

## Demo
1. Show the documentation.
1. Go to `Setting up a Development Environment`, point out that the minimum node requirement is written here.
1. Go to `Code Structure`, talk about the various sections - particularly how UI components link to actions/reducers.
1. Talk about the various high level UI components.
1. Go to the `Quick Start` section in the `User Guide`, show how it is a step by step tutorial of how to drag and drop blocks in the layout view.

   > Point for discussion: what should the User Guide contain? Should Tom outline a top level structure?

1. Talk about how all the screenshots are automated, run `npm run screenshots:smg`.
1. This starts an interactive Cypress run.
1. Run each of the fixtures.
1. Show how the screenshots get created in the Cypress folder.
1. Describe how there is a script in the `docs/source` folder to copy the screenshots into the `SMG` and `userguide` folders in the docs, it is run by running `node copy_screenshots_from_e2e.js`