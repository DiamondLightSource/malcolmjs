# malcolmjs
Malcolm client and web gui written in reactjs

# Installing
Within a directory of your choosing:
```bash
git clone git@github.com:/dls-controls/malcolmjs.git
```

You need a local version of [node](https://nodejs.org) (v6 upwards should work) which you can install
on /scratch and put on your path. Then in the root of this project directory, type:

```bash
npm install
```

Go get some tea for 5 minutes...

# Running in development mode

First of all you need the simulator running:

```bash
/dls_sw/work/targetOS/PandABlocks-server/simserver -f /dls_sw/work/targetOS/PandABlocks-FPGA
```

Then in another terminal you need the malcolm server:

```bash
/dls_sw/work/targetOS/PandABlocks-webcontrol/test_start.sh
```

Running: 

```bash
npm start
```

Runs the app in the development mode.

Open [http://localhost:3000/?wsHost=localhost:8008]() to view it in the browser.

The page will reload if you make edits.

You will also see any lint errors in the console.

# Building a production version

Running:
 
```bash
npm run build
```

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

The contents of the build directory can now be copied to the pymalcolm malcolm/modules/web/www directory

# More information

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Further information on building can be found there.
