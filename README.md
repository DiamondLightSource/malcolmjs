# malcolmjs
Malcolm client and web gui written in reactjs

# Installing
Within a directory of your choosing:
```bash
git clone git@github.com:/dls-controls/malcolmjs.git
```

In the root of this project directory,
type:
```bash
yarn install
```

go get some tea for 5 minutes...



# Building

Uses webpack (version 3).
From the project root directory, use the following command to build bundle.js

```bash
webpack
```

#Reconfiguring the server URL
In js/utils/config.js is the class Config constructor; this is where to
specify any new PandA type servers. The key is a unique identifier to refer to the server
url internally. The url string follows as the value.

```javascript
 this._serverURLTable = Object.freeze({
    pc70     : 'ws://pc0070.cs.diamond.ac.uk:8080/ws',
    pc4      : 'ws://pc0004.cs.diamond.ac.uk:8080/ws',
    isaDev   : 'ws://172.23.252.202/ws',
    isaSpare : 'ws://172.23.252.201/ws',
    simulator: 'ws://localhost:8080/ws'
  });
```
Around the very last vew lines of js/wsWebSocketClient.js
you can hard code the server to use. Example:
```javascript
config.setServerName('pc4');
```

Then it's just a matter of typing webpack and waiting a few seconds.

#Browser rendering
In a browser on you local machine, browse to malcolmjs/index.html
e.g.
```bash
file:///scratch/test/malcolmjs/index.html
```
index.html will load the bundle.js file transpiled with babel via webpack.

