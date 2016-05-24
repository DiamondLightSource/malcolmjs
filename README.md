# malcolmjs
Malcolm client and web gui written in reactjs

# Installing

After creating a local copy of the repo, all the following package dependencies can be installed via npm:
react, react-dom, flux, browserify, reactify, interactjs, object-assign, 
react-addons-update, react-addons-css-transition-group, react-modal,
react-panels, react-sidebar, react-toggle, react-treeview, less

# Building

Uses browserify and reactify to build bundle.js.
From the project root directory, use the following command to build bundle.js

    node_modules/.bin/browserify -t reactify ./js/app.js > bundle.js
