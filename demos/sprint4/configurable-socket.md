# Make socket address configurable

## Stories covered
1. 62 - Allow socket address to be configurable

## Demo
1. describe how there is a settings.json file in the public folder
1. talk about how the `update_settings.js` script is called to initialise that file.
1. show the socket address and the version number in the settings file.
1. Run `npm start` and show the settings file being loaded from the server using the network tab in chrome.
1. Run `npm run ui-only`.
1. Run `npm run server`
1. Show that the page loads with the server on port 8000
1. Change the socket to `8009`, show that the UI won't connect.
1. Run `npm run server` in a new terminal, refresh the UI and show it connects now.

1. Stop the UI and server processes. Put the server socket back to `8000`.
1. Describe how the production build doesn't use this socket url setting, it serves from `ws://window.location.host/ws` - this posed a problem with running the e2e tests as these run against a production build.
1. Show how the npm scripts set an extra variable that is picked up for the e2e tests that still picks up the url setting.
1. Run the e2e tests to show they still work, run `npm run e2e`