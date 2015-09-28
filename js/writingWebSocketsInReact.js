/**
 * Created by twi18192 on 28/09/15.
 */

var React = require('react');

function Client(url, debug, maxRate, username, password){

  //this.getInitialState = function(){ /* No idea if this is the right thing to do, but I suppose it's a start :P */
  //  return {
  //    channelIDIndex: 0,
  //    channelArray: [],
  //    websocket: null,
  //    webSocketOnOpenCallbacks: [],
  //    webSocketOnCloseCallbacks: [],
  //    onServerMessageCallbacks: [],
  //    clientSelf: this,
  //    debug: debug,
  //    defaultTypeVersion: 1,
  //      isLive: false,
  //      forcedClose: false,
  //      jsonFilteredReceived: [],  /* I have a feeling that this and the next array may have some relation to the data sent by the server */
  //      jsonSent: []
  //  };
  //};

  var _state = {
      channelIDIndex: 0,
      channelArray: [],  /* Presumably it holds all the different channels? */
      websocket: null,
      webSocketOnOpenCallbacks: [],
      webSocketOnCloseCallbacks: [],
      webSocketOnErrorCallbacks: [],
      onServerMessageCallbacks: [],
      clientSelf: this,  /* Used as a handle for the Client when in other things like channels */
      debug: debug,
      defaultTypeVersion: 1,
    isLive: false,
    forcedClose: false,
    jsonFilteredReceived: [],  /* I have a feeling that this and the next array may have some relation to the data sent by the server */
    jsonSent: []
  };

  openWebSocket(url, username, password, maxRate);/* This gets its arguments from the input of the Client constructor! */
  /// Oh, so this runs as soon as the constructor is called! ///

  /* Adding the argument 'callback' to the webSocketOnOpenCallbacks array in _state */

  this.addWebSocketOnOpenCallback = function(callback){
    _state.webSocketOnOpenCallbacks.push(callback);
  };

  /* Removing the argument 'callback' from the array webSocketOnOpenCallbacks via the splice method, similarly to how the removeTab function in SidePane works */

  this.removeWebSocketOnOpenCallback = function(callback){
    _state.webSocketOnOpenCallbacks.splice(_state.webSocketOnOpenCallbacks.indexOf(callback), 1);
  };

  /* Adding the argument 'callback' to the webSocketOnCloseCallbacks array in _state */

  this.addWebSocketOnCloseCallback = function(callback){
    _state.webSocketOnCloseCallbacks.push(callback);
  };

  /* Adding the argument 'callback' to the webSocketOnErrorCallbacks array in _state */

  this.addWebSocketOnErrorCallback = function(callback){
    _state.webSocketOnErrorCallbacks.push(callback);
  };

  /* Adding the argument 'callback' to the onServerMessageCallbacks array in _state*/

  this.addOnServerMessageCallback = function(callback){
    _state.onServerMessageCallbacks.push(callback);
  };

  /* Other methods of Client that were further down the page */

  this.getReceivedMessagesPerChannel = function(channelID){
    if(channelID === "*"){
      return _state.jsonFilteredReceived.join("\n");  /* Joins all the elements of the array jsonFilteredReceived into a single string with commas between the elements, no spaces */
                                                      /* Actually, not sure what the "\n" inside the brackets does? */
    }
    else{
      return _state.jsonFilteredReceived[channelID].join("\n"); /* As this is just one element of the array, does it just turn the element into a string? */
    }
  };

  this.getSentMessages = function(){
    return _state.jsonSent.join("\n"); /* Ohhh, the 2nd argument is the separator between each element in the string that gets outputted, so is "\n" adding a new line/line break after each element? */
  };

  this.close = function(){
    _state.forcedClose = true;
    if(_state.websocket !== null){
      _state.websocket.close();
    }
    _state.websocket = null;
  };

  this.sendText = function(text){
    _state.websocket.send(text);  /* Should this refer to the websocket in _state, or something else? */
    if(_state.debug){
      _state.jsonSent.unshift(text);
    }
  };

  /* Find a channel from its id */

  this.getChannel = function(id){
    return _state.channelArray[id];
  };

  /* Self explanatory, lets you get all the channels currently available */

  this.getAllChannels = function(){
    return _state.channelArray;
  };



  /* Stuff to do with channels? :P */

  this.subscribeChannel = function(name, callback, readOnly, type, version, maxRate){
    var typeJson; /* Not entirely sure what this is doing, it's creating a variable without a value? */

    if(readOnly !== false){
      readOnly = true;
    }

    if(type !== null){
      if(version === null){
        version = defaultVersion; /* defaultVersion isn't located anywhere else in the file? */

        typeJson = JSON.stringify({ /* I have a feeling this has something to do with the data from the server, since it's converting a Javascript value to a JSON string */
          "name": type,
          "version": version
        });
      }
    }

    var json = JSON.stringify({ /* I have a feeling that this also relates to the info from the server */
      "message": "subscribe",
      "id": _state.channelIDIndex,
      "channel": name,
      "readOnly": readOnly,
      "maxRate": maxRate,
      "type": typeJson
    });



    var channel = new Channel(name); /* Creating a new channel, with its name as the input argument */ /* Also, not sure if it matters, but the other 'name' arguments above highlight as well when I hover over this argument? Are they connected? */
                                     /* Haha, yep, they are connected, since this is all within one function, subscribeChannel()! :P */
    _state.channelArray[_state.channelIDIndex] = channel; /* For whatever value/number/index channelIDIndex is, that index gets the value of this new channel */
    channel.id = _state.channelIDIndex;
    channel.name = name;
    channel.readOnly = readOnly;
    channel.connected = true;

    if(this.isLive){  /* Hmm, is this referring to the state of the Client, since the Channel constructor doesn't have a property or method entitled isLive? */ /* Not entirely sure what 'this' is referring to in this case... */
      this.sendText(json);  /* Either way, it's asaying to check if a value is true, and if so, do this, and if not, do the stuff below */
    }
    else{
      var webpdaSelf = this; /* No idea what this is for? */
      var listener = null;
      listener = function(evt){  /* Is evt short for event? */ /* Also, is this just redefining the variable listener to be a function rather than null as it is the line previously? */
        _state.clientSelf.sendText(json);

        setTimeout(function(){  /* A function inside another function, but evt never gets passed, so what's the point of giving 'listener' and input argument? */
          _state.clientSelf.removeWebSocketOnOpenCallback(listener); /* Ok, so setTimeout is an internal Javascript function that runs the given function after the number of milliseconds (the 2nd argument) */
        }, 0);
      };

      this.addWebSocketOnOpenCallback(listener);
    }

    if(_state.debug){   /* If _state.debug is true, do the below */ /* Also, it doesn't appear that there's any else or else if statement to follow this? */
      _state.jsonFilteredReceived.unshift([json]); /* .unshift adds the element to the beginning of the given array */
    }

    channel.channelCallback = callback;
    _state.channelIDIndex++; /* Shorthand for incrementing _state.channelIDIndex by one (happens each time the whole function subscribeChannel() gets called) */
                             /* Oh, so this is what prevents each channel fromhaving the same id, the number inside _state is simply just to get it started, it's not used to keep track of every channel and its corresponding index, Isuppose it's used to count how many channels there actually are */
    return channel;
  };



  this.resubscribeChannel = function(ch){ /* Seems fairly similar to this.subscribeChannel() */
    var typeJson;

    if(ch.value.type !== null){
      typeJson = JSON.stringify({
        "name": ch.value.type.name,
        "version": ch.value.type.version
      });
    }

    var json = JSON.stringify({
      "message": "subscribe",
      "id": ch.id,
      "channel": ch.name,
      "readOnky": ch.readOnly,
      "type": typeJson,
      "maxRate": ch.maxRate
    });

    var channel = new Channel(ch.name);
    _state.channelArray[ch.id] = channel;
    channel.id = ch.id;
    channel.name = ch.name;
    channel.readOnly = ch.readOnly;
    channel.connected = true;

    if(this.isLive){
      this.sendText(json);
    }
    else{
      var webpdaSelf = this;
      var listener = null;
      listener = function(evt){
        _state.clientSelf.sendText(json);

        setTimeout(function(){
          _state.clientSelf.removeWebSocketOnOpenCallback(listener)
        }, 0)
      };

      this.addWebSocketOnOpenCallback(listener); /* After this, it's simpler than this.sunscribeChannel() */

    }
    channel.channelCallback = ch.channelCallback;
    return channel; /* Hmm, in subscribeChannel at the end it raised _state.channelIDIndex by 1, bu here it doesn't?*/
                    /* Is it because it's called resubscribeChannel, so that means the Client is already aware of this channel, thus it's already got an associated channelIDIndex inside _state.channelArray? */
                    /* Surely that means that at one point that it was subscribed and then it wasn't? So then there must be an 'unsubscribe'function somewhere? */
  };



  /* The functions that aren't methods of the Client, but can be used by everything in here I guess? */


  function openWebSocket(url, username, password, maxRate){
    if((url.indexOf("wss://") !== -1 && username !== null) || maxRate !== null){ /* So there's two options for this loop to go to the code that executes on a 'true' output:
                                                                                 /* Either, the string "wss://" can be found (ie, output of indexOf("wss://") is NOT equal to -1) AND (double ampersand) the input 'username' is not null */
                                                                                 /* Or the input maxRate is not null; either of those scenarios will allow the 'true' block of code to execute */
      url = url + "?";

      if(maxRate !== null){     /* these are additional sub-checks if you will, to check individual inputs and their values */
        url = url + "maxRate=" + maxRate;
      }

      if(url.indexOf("wss://") !== -1){ /* This is basically saying that, if all the inputs apart from password are vald and not null, run the given code */
        if(username !== null){
          if(maxRate !== null){
            url = url + "&";
          }

          url = url + "user=" + username + "&password=" + password /* This statement only relies on the url and username inputs being valid, it doesn't depend on the maxRate input like the statement further inside this loop */

        }
      }

    }

    if("WebSocket" in window){  /* The window object refers to an open window in a browser */
      _state.websocket = new WebSocket(url); /* new WebSocket is an inbuilt function of Javascript */
    }
    else if("MozWebSocket" in window){    /* I suppose these two cases are seeing if WebSockets are usable in the browser that the user is using? */
      _state.websocket = new WebSocket(url);
    }
    else{
      throw new Error("WebSocket isn't supoported by this browser.");
    }
    _state.websocket.binaryType = "arraybuffer"; /* binaryType is associated with WebSockets */

    _state.websocket.onopen = function(evt){   /* onopen is another thing to do with WebSockets */
      fireOnOpen(evt);
    };

    _state.websocket.onmessage = function(evt){ /* I think all these methods with websocket.method are associated/builtin in WebSockets */
      var json;
      json = JSON.parse(evt.data);
      dispatchMessage(json);
    };

    _state.websocket.onerror = function(evt){
      fireOnError(evt);
    };

    _state.websocket.onclose = function(evt){
      fireOnClose(evt);
    };

    if(_state.debug){
      _state.onServerMessageCallbacks.push(function(json){
        _state.jsonFilteredReceived[json.id].unshift(JSON.stringify(json));
      });
      _state.webSocketOnErrorCallbacks.push(function(evt){
        _state.jsonFilteredReceived[json.id].unshift(JSON.stringify(json)); /* Should this be evt instead of json? */
      }); /* Don't get confused, both of these run if the if statement returns as true */
    }

  }


  function dispatchMessage(json){
    if(json.message !== null){
      handleServerMessage(json);
    }

    if(json.id !== null){
      if(_state.channelArray[json.id] !== null){
        _state.channelArray[json.id].fireChannelEventFunc(json);
      }
    }
  }

  function handleServerMessage(json){
    if(json.type === "error"){
      console.log("Error: " + json.error); /* Provides an error related to the input to make debugging easier I suppose? */
    }
    fireOnServerMessage(json);
  }

  function processJsonForChannel(json, Channel){ /* Could potentially replace this with the lookup method I used for paneStore */

    switch(json.type){

      case "connection":
            Channel.connected = json.connected;
            Channel.readOnly = !json.writeConnected;
            break;

      case "value":
            Channel.value = json.value;
            break;

      default:
            break;
    }
  }

  function fireOnOpen(evt){
    _state.clientSelf.isLive = true; /* I have a feeling that this won't work, since isLive lives inside _state too? */
                                     /* Perhaps it should just be _state.isLive? */
    for(var i in _state.webSocketOnOpenCallbacks){
      _state.webSocketOnOpenCallbacks[i](evt);  /* Every function in this array gets passed the input 'evt' */

    }
  }

  function fireOnClose(evt){
    _state.isLive = false; /* Trying the other way! */
    var url = evt.currentTarget.url /* Look back at the .currentTarget method */

    if(_state.forcedClose){
      for(var c in _state.channelArray){
        _state.channelArray[c].unsubscribe(); /* Is this referring to the Channel method, or the function a bit later on? */
      }
      for(var i in _state.webSocketOnCloseCallbacks){
        _state.webSocketOnCloseCallbacks[i](evt);
      }
    }
    else{
      setTimeout(function(){
        openWebSocket(url); /* Define this later */

        for(var c in _state.channelArray){  /* So this function runs after 10000 milliseconds */ /* So I suppose this has something to do with resubscribing channels after a set interval of time (whatever that means :P)? */
          _state.clientSelf.resubscribeChannel(_state.channelArray[c]);
        }
      }, 10000);
    }
  }

  function fireOnError(evt){  /* If an error occurs, run the erro messages from all the function inside webSocketErrorCallbacks */
    for(var i in _state.webSocketOnErrorCallbacks){
      _state.webSocketOnErrorCallbacks[i](evt);
    }
  }

  function fireOnServerMessage(json){ /*If a message is received (not sure where from), run all the functions in the array onServerMessageCallbacks */
    for(var i in _state.onServerMessageCallbacks){
      _state.onServerMessageCallbacks[i](json)
    }
  }






  /* Defining the Channel constructor */

  function Channel(name){ /* Hmm, not sure the best way to get this to have state... */

    this.name = name;
    this.id = -1;
    this.value = null;
    this.channelCallback = null; /* not sure why this gets 'unused definition' and the others don't? */
    this.paused = false;
    this.connected = false;
    this.readOnly = true;

    /* Chucking all the prototype function additions in the constructor */

    this.isConnected = function(){
      return this.connected;
    };

    this.getId = function(){
      return this.id;
    };

    this.isWriteAllowed = function(){
      return !this.readOnly;  /* Why return the opposite of readOnly? I suppose read and write and vaguely related...*/
    };

    this.isPaused = function(){
      return this.paused;
    };

    this.getValue = function(){
      return this.value;
    };

    this.removeCallback = function(callback){ /* Not sure why it doesn't have this. in front of it in the original JS file? */
      this.channelCallback = null;            /* Plus, what's the point of having an input argument that isn't used in the function? */
    };

    this.setValue = function(value){
      if(!this.readOnly){
        setChannelValue(this.id, value);
      }
    };

    this.updateValue = function(){
      if(!this.readOnly){
        setChannelValue(this.id, this.value.value);
      }
    };

    this.unsubscribe = function(){
      unsubscribe(this.id);
    };

    this.pause = function(){
      this.paused = true;
      pauseChannel(this.id);
    };

    this.resume = function(){
      this.paused = false;
      resumeChannel(this.id);
    };

    this.fireChannelEventFunc = function(json){
      processJsonForChannel(json, this);  /* Defined later, with sendText */
      this.channelCallback(json, this);
    };

  }

  /* All these functions appear to relate to the channel and interacting with it; ie, relaying messages to different channels, and the channelsare distinguished by their id? */

  function setChannelValue(channelIDIndex, value){
    var json = JSON.stringify({
      "message": "write",
      "id": channelIDIndex,
      "value":value
    });

    _state.clientSelf.sendText(json);  /* Don't worry, sendText is defined later (line 277 of original file) */

  }

  function unsubscribe(channelIDIndex){
    var json = JSON.stringify({
      "message": "unsubscribe",
      "id": channelIDIndex
    });

    _state.clientSelf.sendText(json);
    delete _state.channelArray[channelIDIndex];
  }

  function pauseChannel(channelIDIndex){
    var json = JSON.stringify({
      "message": "pause",
      "id": channelIDIndex
    });

    _state.clientSelf.sendText(json);
  }

  function resumeChannel(channelIDIndex){
    var json = JSON.stringify({
      "message": "resume",
      "id": channelIDIndex
    });

    _state.clientSelf.sendText(json)
  }

}
