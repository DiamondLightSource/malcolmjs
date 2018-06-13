# Performance fixes

## Stories covered
1. #145 - Fix performance to stop unnecessary renders

## Demo
1. Run `npm start` and navigate to http://localhost:3000/gui/PANDA/layout/PANDA:SEQ1
1. Open the dev tools in the browser and switch to the React tools.
1. Turn on the option to `Highlight Updates`.
1. Show that the only parts of the page that are updating are the `Outa` and `Outc` attributes.
1. Turn off the `Highlight Updates` option.
1. Go to `subscriptionFeed.js` in the server and make the update time for `Outa` 100ms, navigate back to the page and show the LED updating.
1. Open `Task Manager` and show that chrome is using about 13% of the CPU.
1. Close the child panel and show the CPU drops to about 5%.