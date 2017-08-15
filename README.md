# malcolmjs
Malcolm client and web gui written in reactjs

# Installing
In the root of this project directory, 
type "npm install" - go get some tea... 

# Building

Uses browserify and reactify to build bundle.js.
From the project root directory, use the following command to build bundle.js

    node_modules/.bin/browserify -t reactify ./js/app.js > bundle.js

