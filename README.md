# malcolmjs
Malcolm client and web gui written in reactjs

# Installing

    git clone git@github.com:yousefmoazzam/react-panels.git
    git clone git@github.com:dls-controls/malcolmjs.git
    cd malcolmjs
    npm install react react-dom flux browserify reactify interact-js \
        object-assign react-addons-update react-addons-css-transition-group \
        react-modal react-sidebar react-toggle react-treeview less
    npm install ../react-panels

# Building

Uses browserify and reactify to build bundle.js.
From the project root directory, use the following command to build bundle.js

    node_modules/.bin/browserify -t reactify ./js/app.js > bundle.js
