/**
 * Created by twi18192 on 28/09/15.
 */

var serverActions = require('./actions/serverActions');
var paneActions = require('./actions/paneActions');

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

  //var _state = {
  //  channelIDIndex: 0,
  //  channelArray: [],  /* Presumably it holds all the different channels? */
  //  websocket: null,
  //  webSocketOnOpenCallbacks: [],
  //  webSocketOnCloseCallbacks: [],
  //  webSocketOnErrorCallbacks: [],
  //  onServerMessageCallbacks: [],
  //  clientSelf: this,  /* Used as a handle for the Client when in other things like channels */
  //  debug: debug,
  //  defaultTypeVersion: 1,
  //  isLive: false,
  //  forcedClose: false,
  //  jsonFilteredReceived: [],  /* I have a feeling that this and the next array may have some relation to the data sent by the server */
  //  jsonSent: []
  //};

      var channelIDIndex = 0;
      var channelArray = []; /* Presumably it holds all the different channels? */
      var websocket = null;
      var webSocketOnOpenCallbacks = [function(){console.log("function inside webSocketOnOpenCallbacks array")}, function(){console.log("another function in the array")}];
      var webSocketOnCloseCallbacks = [];
      var webSocketOnErrorCallbacks = [];
      var onServerMessageCallbacks = [function(){console.log("message from the server callback array")}];
      var clientSelf = this; /* Used as a handle for the Client when in other things like channels */
      var debug = debug;
      var defaultTypeVersion = 1;
  var isLive = false;
  var forcedClose = false;
  var jsonFilteredReceived = []; /* I have a feeling that this and the next array may have some relation to the data sent by the server */
  var jsonSent = [];

  this.checkStateOfWebSocketConnection = function(){
    console.log(websocket.readyState)
  };



  openWebSocket(url, username, password, maxRate);/* This gets its arguments from the input of the Client constructor! */
  /// Oh, so this runs as soon as the constructor is called! ///

  /* Adding the argument 'callback' to the webSocketOnOpenCallbacks array */

  this.addWebSocketOnOpenCallback = function(callback){
    webSocketOnOpenCallbacks.push(callback);
  };

  /* Removing the argument 'callback' from the array webSocketOnOpenCallbacks via the splice method, similarly to how the removeTab function in SidePane works */

  this.removeWebSocketOnOpenCallback = function(callback){
    webSocketOnOpenCallbacks.splice(webSocketOnOpenCallbacks.indexOf(callback), 1);
  };

  /* Adding the argument 'callback' to the webSocketOnCloseCallbacks array */
  /* So when websocket.onclose runs, it then runs fireOnClose, which then looks at the array
  webSocketOnCloseCallbacks and runs all the functions inside that array, one by one;
  this function is essentially adding more callback functions to that array.
  Same for all the other functions here really (apart from removeWebSocketOnCallback,
  but in principle it's the same idea, just removing a callback instead of adding one)
   */

  this.addWebSocketOnCloseCallback = function(callback){
    webSocketOnCloseCallbacks.push(callback);
  };

  /* Adding the argument 'callback' to the webSocketOnErrorCallbacks array */

  this.addWebSocketOnErrorCallback = function(callback){
    webSocketOnErrorCallbacks.push(callback);
  };

  /* Adding the argument 'callback' to the onServerMessageCallbacks array */
  /* So this adds a callback function that is notified when the Websocket receives a message from the server */

  this.addOnServerMessageCallback = function(callback){
    onServerMessageCallbacks.push(callback);
  };



  /* Stuff to do with channels? :P */
  /* More importantly, the two functions that create new Channel objects! */

  this.subscribeChannel = function(name, callback, readOnly, type, version, maxRate){
    var typeJson; /* Not entirely sure what this is doing, it's creating a variable without a value? */
                  /* Yep, it implicitly is a variable of type 'undefined'; it's usually used to declare variables for later use */

    if(readOnly !== false){
      readOnly = true;
    }

    if(type !== null){
      if(version === null){
        version = defaultVersion; /* defaultVersion isn't located anywhere else in the file? */ /* Well, it's unknown in the original file too, so I guess it's fine? */ /* There's an unused variable (and in the original file): defaultTypeVersion? */

        typeJson = JSON.stringify({ /* I have a feeling this has something to do with the data from the server, since it's converting a Javascript value to a JSON string */
          "name": type,
          "version": version
        });
      }
    }

    var json = JSON.stringify({ /* I have a feeling that this also relates to the info from the server */
      "message": "subscribe",
      "id": channelIDIndex,
      "channel": name,
      "readOnly": readOnly,
      "maxRate": maxRate,
      "type": typeJson
    });

    var channel = new Channel(name); /* Creating a new channel, with its name attribute set as the input argument; note that the variable is called 'channel' though for ALL channels subscribed */ /* Also, not sure if it matters, but the other 'name' arguments above highlight as well when I hover over this argument? Are they connected? */
                                     /* Haha, yep, they are connected, since this is all within one function, subscribeChannel()! :P */
    channelArray[channelIDIndex] = channel; /* For whatever value/number/index channelIDIndex is, that index gets the value of this new channel */
    channel.id = channelIDIndex;
    channel.name = name;
    channel.readOnly = readOnly;
    channel.connected = true;

    if(this.isLive){  /* Hmm, is this referring to the state of the Client, since the Channel constructor doesn't have a property or method entitled isLive? */ /* Not entirely sure what 'this' is referring to in this case... */
      this.sendText(json);  /* Either way, it's a'saying to check if a value is true, and if so, do this, and if not, do the stuff below */
                            /* Another note, this sendText command is simply to tell ther server that another
                            channel has been subscribed
                             */
                            /* UPDATE: Oh ok, so if the websocket connection is already live, just send a message
                            to the server telling it that another Channel has been subscribed, but if the websocket
                            conenction ISN'T open, do the else block of code and add a callback to run when the websocket
                            connection DOES open to let the user know that this particular Channel exists and is subscribed!
                             */
    }
    else{
      var webpdaSelf = this; /* No idea what this is for? */ /* So WebPDA is something to do with accessing data in realtime via websockets, look it up again if you want more info! */
      var listener = null;
      listener = function(evt){  /* Is evt short for event? */ /* Also, is this just redefining the variable listener to be a function rather than null as it is the line previously? */
        clientSelf.sendText(json);

        setTimeout(function(){  /* A function inside another function, but evt never gets passed, so what's the point of giving 'listener' and input argument? */
          clientSelf.removeWebSocketOnOpenCallback(listener); /* Ok, so setTimeout is an internal Javascript function that runs the given function after the number of milliseconds (the 2nd argument) */
        }, 0);                                                /* What's the point of using setTimeout if it's gonna run after 0 milliseconds (ie, immediately)? */
      };

      this.addWebSocketOnOpenCallback(listener);
    } /* What is the point of this else part of the loop; all it does is sendText(json) just like the if part,
    removes a callback from webSocketOnOpenCallbacks after 0 milliseconds,and then adds the SAME callback
    back again to the SAME array??? Perhaps cleanup? */
    /* On a separate note, I guess adding a callback for when the websocket connections is open is to be
    able to then print to console that this particular channel is active
     */

    if(debug){   /* If debug is true, do the below */ /* Also, it doesn't appear that there's any else or else if statement to follow this? */
      jsonFilteredReceived.unshift([json]); /* .unshift adds the element to the beginning of the given array */
    }

    channel.channelCallback = callback;
    channelIDIndex++; /* Shorthand for incrementing channelIDIndex by one (happens each time the whole function subscribeChannel() gets called) */
    /* Oh, so this is what prevents each channel from having the same id, the number inside the variable channelIDIndex is simply just to get it started, it's not used to keep track of every channel and its corresponding index, */
    /* I suppose it's used to count how many channels there actually are */
    return channel;
  };



  this.resubscribeChannel = function(ch){ /* Seems fairly similar to this.subscribeChannel() */
                                          /* However, not that its sole input argument is a Channel, not like subscribe where it had 5 parameters! */
                                          /* So this must somehow 'undo' the unsubscribe function? */
                                          /* Ah ok, unsubscribe simply removes the channel object from channelArray (or more accurately, it sets it as undefined within the array),
                                            but the Channel object still exists, so you can still use the usual Channel methods and everything else to refer to that particular Channel object.
                                            Also note that it could potentially still keep its original index/channelIDIndex value from before it was unsubscribed!!
                                             */

    console.log("resubscribing channel");

    var typeJson;

    if(ch.value.type !== null){     /* I'm not entirely sure what ch.value.type is; like, a '.type' Javascript method doesn't exist so it can't simply be checking the data type can it (even thought that definitely is what it lookes like it's doing! :P)? */
      typeJson = JSON.stringify({
        "name": ch.value.type.name,
        "version": ch.value.type.version
      });
    }

    /* As the input Channel already existed, it already has all these attributes/properties that are part of the object, so this
    is simply reattaching these attribute values to the variable 'json' that is associated with the channel
     */

    var json = JSON.stringify({
      "message": "subscribe",
      "id": ch.id,
      "channel": ch.name,
      "readOnly": ch.readOnly,
      "maxRate": ch.maxRate,
      "type": typeJson
    });

    /* Hmm, this part contradicts my statement just above; if the Channel objects still exists, and is just undefined inside
    channelArray, then why is it creating a new Channel object here, and then setting the properties of this new
    Channel object to have the same properties as the old Channel object? Surely if that old Channel object still
    existed and had all its properties still intact outside channelArray, you could just set the corresponding index
    of channelArray equal to this old Channel object again without creating a new one and transferring all
    the old properties to this new one? Because then if both of these Channel objects exist, they'll both have the
    same name and everything, causing conflict when referring to one or the either?
     */

    var channel = new Channel(ch.name);
    channelArray[ch.id] = channel;
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
        clientSelf.sendText(json);

        setTimeout(function(){
          clientSelf.removeWebSocketOnOpenCallback(listener)
        }, 0)
      };

      this.addWebSocketOnOpenCallback(listener); /* After this, it's simpler than this.subscribeChannel() */

    }
    channel.channelCallback = ch.channelCallback;
    return channel; /* Hmm, in subscribeChannel at the end it raised channelIDIndex by 1, but here it doesn't?*/
    /* Is it because it's called resubscribeChannel, so that means the Client is already aware of this channel, thus it's already got an associated channelIDIndex inside channelArray? */ /* UPDATE: Basically, yeah :P */
    /* Surely that means that at one point that it was subscribed and then it wasn't? So then there must be an 'unsubscribe' function somewhere? */ /* UPDATE: Again, basically yeah :P */
  };







  /* Other methods of Client that were further down the page */

  this.getReceivedMessagesPerChannel = function(channelID){
    if(channelID === "*"){
      return jsonFilteredReceived.join("\n");  /* Joins all the elements of the array jsonFilteredReceived into a single string with commas between the elements, no spaces */
                                                      /* Actually, not sure what the "\n" inside the brackets does? */
    }
    else{
      return jsonFilteredReceived[channelID].join("\n"); /* As this is just one element of the array, does it just turn the element into a string? */
                                                         /* UPDATE: I have a feeling that the array jsonFilteredReceived will have arrays as
                                                         its elements, so the asterix * in the code above this line is used to specify that you want
                                                         the json messages received by the client from the server by EVERY channel,
                                                         and if you just want the json messages received by a particular channel you specify that channel's
                                                         channelID!
                                                          */
    }
  };

  this.getSentMessages = function(){
    return jsonSent.join("\n"); /* Ohhh, the 2nd argument is the separator between each element in the string that gets outputted, so is "\n" adding a new line/line break after each element? */
  };

  this.close = function(){
    forcedClose = true;
    if(websocket !== null){
      websocket.close();
    }
    websocket = null;
  };

  this.sendText = function(text){
    //console.log("inside sendText");
    //console.log("channelArray state again");
    //console.log(channelArray);
    websocket.send(text);  /* Should this refer to the websocket variable, or something else? */
    //console.log("ok, after sendText now!");
    if(debug){

      jsonSent.unshift(text); /* Basically, I think this is to aid debugging: if debug is set to true,
                              the array jsonSent gets another entry added to the beginning of itself */
    }
  };

  /* Find a channel from its id */

  this.getChannel = function(id){
    console.log(channelArray[0]);
    return channelArray[id];
  };

  /* Self explanatory, lets you get all the channels currently available */

  this.getAllChannels = function(){
    console.log("the following is the channelArray");
    console.log(channelArray);
    return channelArray;
  };




  /* The functions that aren't methods of the Client, but can be used by everything in here I guess? */


  function openWebSocket(url, username, password, maxRate){
    //var test = "test"
    //console.log(typeof test)
    //console.log(url)
    //console.log("what is this...")
    if((url.indexOf("wss://") !== -1 && username !== null) || maxRate !== null){ /* So there's two options for this loop to go to the code that executes on a 'true' output:
                                                                                 /* Either, the string "wss://" can be found (ie, output of indexOf("wss://") is NOT equal to -1) AND (double ampersand) the input 'username' is not null */
                                                                                 /* Or the input maxRate is not null; either of those scenarios will allow the 'true' block of code to execute */
      url = url + "?";

      if(maxRate !== null){     /* these are additional sub-checks if you will, to check individual inputs and their values */
        url = url + "maxRate=" + maxRate;
      }

      if(url.indexOf("wss://") !== -1){ /* This is basically saying that, if all the inputs apart from password are valid and not null, run the given code */
        if(username !== null){
          if(maxRate !== null){
            url = url + "&";
          }

          url = url + "user=" + username + "&password=" + password;  /* This statement only relies on the url and username inputs being valid, it doesn't depend on the maxRate input like the statement further inside this loop */

        }
      }
    }

    if("WebSocket" in window){  /* The window object refers to an open window in a browser */
      websocket = new WebSocket(url); /* new WebSocket is an inbuilt function of Javascript */
    }
    else if("MozWebSocket" in window){    /* I suppose these two cases are seeing if WebSockets are usable in the browser that the user is using? */
      websocket = new MozWebSocket(url);
    }
    else{
      throw new Error("WebSocket isn't supported by this browser.");
    }
    websocket.binaryType = "arraybuffer"; /* binaryType is associated with WebSockets */

    /* Ok, so you dont' actually directly invoke the onopen, onclose functions below, the methods ofthe Client listed above take care of those */

    websocket.onopen = function(evt){   /* onopen is another thing to do with WebSockets */
      console.log(evt);
      fireOnOpen(evt);
      console.log("websocket has been opened")
    };

    websocket.onmessage = function(evt){ /* I think all these methods with websocket.method are associated/builtin in WebSockets */
      console.log("message has been received from server via websocket");
      var json;
      json = JSON.parse(evt.data);
      console.log("Here is the event:");
      console.log(evt);
      dispatchMessage(json);
    };

    websocket.onerror = function(evt){  /* This is the only thing that invokes fireOnError I think */
      fireOnError(evt);
    };

    websocket.onclose = function(evt){
      fireOnClose(evt);
      console.log("websocket has been closed")
    };

    if(debug){
      onServerMessageCallbacks.push(function(json){
        jsonFilteredReceived[json.id].unshift(JSON.stringify(json)); /* Adds a function that runs whenever a message from
                                                                      the server is received, and the function adds another entry
                                                                      to jsonFilteredReceived,and the entry consists of
                                                                      ?? a filtered version of the json message received from the server ??
                                                                      */
      });
      webSocketOnErrorCallbacks.push(function(evt){
        jsonFilteredReceived[json.id].unshift(JSON.stringify(json)); /* Should this be evt instead of json? */
      }); /* Don't get confused, both of these run if the if statement returns as true */
    }
  }



  function dispatchMessage(json){
    //console.log("in dispatchMessage, one more update");
    //console.log(json);
    //console.log(json.id);
    //console.log(channelArray);
    //console.log(channelArray[0]);

    console.log("websocket.onmessage has invoked dispatchMessage, here's the full json and json.message from the server:");
    console.log(json);
    console.log(json.message);

    if(json.message !== null){ /* There's no else prt to this outer loops, so I guess if json.message is null then don't do anything? */
      if(channelArray[json.id] === undefined){
        console.log("channel was unsubscribed, so channelArray[json.id] doesn't exist anymore")
      }
      else{
        handleServerMessage(json);
      }
    }

    if(json.id !== null){
      if(channelArray[json.id] !== null){
        if(channelArray[json.id] === undefined){
          console.log("channel was unsubscribed, so channelArray[json.id] doesn't exist anymore")
        }
        else {
          console.log("dispatchMessage is now about to invoke fireChannelEventFunc");
          channelArray[json.id].fireChannelEventFunc(json);  /* The only thing that invokes fireChannelEventFunc,which in turn is the only
                                                              thing that invokes processJsonForChannel, which is what is used for updating
                                                              Channel values */
                                                             /* This only invokes after websocket.onmessage, ie after a message from the server
                                                             is received (and presumably, this message from the server contains the updated data/value)
                                                              */
          }
        }
      }
    }


  function handleServerMessage(json){
    if(json.type === "error"){
      console.log("Error: " + json.error); /* Provides an error related to the input to make debugging easier I suppose? */
    }
    fireOnServerMessage(json);
  }

  function fireOnError(evt){  /* If an error occurs, run the error messages from all the function inside webSocketErrorCallbacks */
    for(var i in webSocketOnErrorCallbacks){
      webSocketOnErrorCallbacks[i](evt);
    }
  }

  function fireOnServerMessage(json){ /*If a message is received (not sure where from), run all the functions in the array onServerMessageCallbacks */
    for(var i in onServerMessageCallbacks){
      onServerMessageCallbacks[i](json)
    }
  }

  function processJsonForChannel(json, Channel){ /* Could potentially replace this with the lookup method I used for paneStore */
                                                 /* Also, I think this may also potentially be the function that alters/updates the Channel attribute value,
                                                    since it runs after a message/data from the server is received and it has a json and channel input!
                                                     */
    console.log("Inside processJsonForChannel, here's the Channel whose value we're changing and the json too:");
    console.log(Channel);
    console.log(json);
    switch(json.type){

      case "connection":
            Channel.connected = json.connected;
            Channel.readOnly = !json.writeConnected;
            break;

      case "value":
            Channel.value = json.value;
            break;

      default:
        console.log("Switch statement runs the default case, something's up?");
            break;
    }
    //console.log("Here's the new Channel value:");
    //console.log(Channel.value);
    //console.log("Here's channelArray:");
    //console.log(channelArray);


    console.log("Forget trying all the hard stuff, all I'm gonna do is pass the channel name!");

    /* So I guess here (or more specifically, inside ths witch statement in the future) would be where the action to pass the data to deviceStore.
     Not sure if I'm meant to out this function into WebAPIUtils, but for now I'll just try and get this working before I start to get fancy :P */

    serverActions.passingNameOfChannelThatsBeenAdded(json.channel)


  }

  function fireOnOpen(evt){
    console.log(evt);
    //var _clientSelf = clientSelf; /* Not needed anymore I don't think, now that I eliminated _state */
    //var _isLive = isLive;
    console.log("inside fireOnOpen function");
    clientSelf.isLive = true; /* I have a feeling that this won't work, since isLive lives inside _state too? */
                                     /* Perhaps it should just be _state.isLive? */ /* Oh ok, no, I think this is right, since _state.clintSelf is a handle on the Client when the keyword 'this' could be something else (ie, when you're inside a function like now!)
                                     /* So it's the same as 'this.isLive' when used in the scope of Client, except you have to refer to 'this' as _state.clientSelf since we AREN'T in the scope of Client, we're in a function! */
                                     /* Haha, back and forth, but actually I don't think this works, since once you have the handle on Client, you STILL need to access _state.isLive!?! */
                                     /* Ok, I think that may have fixed it, but who knows? :P */
    for(var i in webSocketOnOpenCallbacks){
      //console.log(webSocketOnOpenCallbacks[i](evt));
      //console.log(webSocketOnOpenCallbacks[i]);
      webSocketOnOpenCallbacks[i](evt);  /* Every function in this array gets passed the input 'evt' */
    }
  }

  function fireOnClose(evt){
    isLive = false; /* Trying the other way! */
    var url = evt.currentTarget.url; /* Look back at the .currentTarget method */

    if(forcedClose){
      for(var c in channelArray){
        channelArray[c].unsubscribe(); /* Is this referring to the Channel method, or the function a bit later on? */
                                       /* UPDATE: It's the Channel method, but it didn't really matter, the method invokes
                                       the other function I was thinking of anyway!
                                       Also, this makes it look like forcedClose (when its value is 'true') is used
                                       to unsubscribe ALL Channels
                                        */
      }
      for(var i in webSocketOnCloseCallbacks){
        webSocketOnCloseCallbacks[i](evt);
      }
    }

    /* So if forcedClose set to 'false' wasn't used, then this following block runs, and this essentially (after 10,000 milliseconds)
    opens the websocket connection again with the same server url as before, and resubscribes all the
    channels that are in channelArray.
     */

    else{
      setTimeout(function(){
        openWebSocket(url); /* Define this later */ /* Hmm, I don't get the 'invalid no. of input arguments' when I should, like the original file has? */

        for(var c in channelArray){  /* So this function runs after 10000 milliseconds */ /* So I suppose this has something to do with resubscribing channels after a set interval of time (whatever that means :P)? */
          clientSelf.resubscribeChannel(channelArray[c]);
        }
      }, 10000);
    }
  }








  /* Defining the Channel constructor */

  function Channel(name){ /* Hmm, not sure the best way to get this to have state... */

    this.name = name;
    this.id = -1;   /* Look at the docs and their definition of getId, getValue: it says that they can have any data type, hence they can be strings, numbers, floats, objects etc */
    this.value = null;
    this.channelCallback = null; /* not sure why this gets 'unused definition' and the others don't? */ /* Update: it doesn't now, maybe it changed? */
    this.paused = false;
    this.connected = false;
    this.readOnly = true;

    /* Chucking all the prototype function additions in the constructor */
    /* These internal methods of an object of the Channel class are used to return/access values of a channel object from OUTSIDE a channel,
    hence, these functions are ALWAYS invoked from outside a channel */

    this.channelValueType = function(){
      console.log(typeof this.value);
      console.log(this.value);
    };

    this.isConnected = function(){
      return this.connected;
    };

    this.getId = function(){
      return this.id;
    };

    this.isWriteAllowed = function(){
      return !this.readOnly;  /* Why return the opposite of readOnly? I suppose read and write are related?*/
                              /* Oh, it's that if it's not just read only, it has to be able to write as well, since read only means you can only read and NOT write :P */
    };

    this.isPaused = function(){
      return this.paused;
    };

    this.getValue = function(){
      return this.value;
    };

    this.removeCallback = function(callback){ /* Not sure why it doesn't have 'this.' in front of it in the original JS file? */
      this.channelCallback = null;            /* Plus, what's the point of having an input argument that isn't used in the function? */
    };

    this.setValue = function(value){  /*So, if the opposite of the value of readOnly is true, run this code */
      if(!this.readOnly){
        console.log("Inside setValue");
        console.log(value);
        setChannelValue(this.id, value);
      }
      else{
        console.log("Channel is read only, cannot write")
      }
    };

    /* What's the difference between setValue and updateValue? :/
    I suppose at least they invoke the same function...
     */

    this.updateValue = function(){
      if(!this.readOnly){
        setChannelValue(this.id, this.value.value); /* No idea what this.value.value is referring to? */
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

    /* On a side note, what do pause and resume actually 'mean' when it comes to a channel?
    Does it mean that you temporarily cannot send data across that particular channel when paused?
    UPDATE: answer is in the docs :P; pause means to pause receiving notifications about that particular channel.
     */

    this.fireChannelEventFunc = function(json){
      console.log("firChanneklEventFunc is about to invoke processJsonForChannel, the thing that actually changes Channel attribute values!");
      processJsonForChannel(json, this);  /* The only thing that invokes processJsonForChannel */
      this.channelCallback(json, this); /* I suppose channelCallback is just a function that lets you know that
                                          fireChannelEventFunc has occurred/ran (a console log will probably suffice)
                                          Furthermore, since the inputs are 'this' and 'json', I guess it's pointing
                                          to you logging which channel the info is travelling across, and what the info
                                          travelling across is*/
    };

  }

  /* All these functions are related to channels and interaction with them; ie, relaying messages to different channels, and the channels are distinguished by their id? */

  function unsubscribe(channelIDIndex){
    console.log("unsubscribing a channel");
    //console.log("the following is an update on channelArray");
    //console.log(channelArray);
    var json = JSON.stringify({
      "message": "unsubscribe",
      "id": channelIDIndex
    });

    clientSelf.sendText(json);
    delete channelArray[channelIDIndex]; /* delete sets the desired object as undefined instead of removing, and also doesn't shorten the array length? */
    //channelArray.splice(channelIDIndex,1);
    //console.log(channelArray);
  }

  function pauseChannel(channelIDIndex){
    var json = JSON.stringify({
      "message": "pause",
      "id": channelIDIndex
    });

    clientSelf.sendText(json);
  }

  function resumeChannel(channelIDIndex){
    var json = JSON.stringify({
      "message": "resume",
      "id": channelIDIndex
    });

    clientSelf.sendText(json)
  }

  /* Ok, I'm starting to not understand this again: the function below is called setChannelValue, and one of
  its inputs is the new value of the channel (presumably). After the json variable is set, a message goes to THE SERVER with this info;
  Now, I thought the whole idea was that the new value was FETCHED FROM THE SERVER, and then the Client gets
  notified that the new data has been fetched, but here it looks like the new value gets SET FIRST, and
  THEN THE SERVER IS NOTIFIED OF THIS CHANGE?
   */

  function setChannelValue(channelIDIndex, value){
    console.log("Inside setChannelValue");
    console.log(channelIDIndex);
    console.log(value);
    var json = JSON.stringify({
      "message": "write",
      "id": channelIDIndex,
      "value":value
    });

    clientSelf.sendText(json);  /* Don't worry, sendText is defined later (line 277 of original file) */

  }

}

module.exports = Client;

//var ReactClient = new Client("wss://echo.websocket.org", null, 10, null, null);
