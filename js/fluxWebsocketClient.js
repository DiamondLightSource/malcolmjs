/**
 * Created by twi18192 on 18/02/16.
 */

/* Main Client constructor function */

var idLookupTableFunctions = require('./utils/idLookupTable');

function Client(url){

  var channelIDIndex = 0;
  var channelObject = {}; /* Presumably it holds all the different channels? */
  var websocket = null;
  var webSocketOnOpenCallbacks = [function(){console.log("function inside webSocketOnOpenCallbacks array")}, function(){console.log("another function in the array")}];
  var webSocketOnCloseCallbacks = [];
  var webSocketOnErrorCallbacks = [];
  var onServerMessageCallbacks = [function(){console.log("message from the server callback array")}];
  var clientSelf = this; /* Used as a handle for the Client when in other things like channels */
  //var debug = debug;
  var defaultTypeVersion = 1;
  var isLive = false;
  var forcedClose = false;
  var jsonFilteredReceived = []; /* I have a feeling that this and the next array may have some relation to the data sent by the server */
  var jsonSent = [];

  /* Things I've added */
  var blockData = {};
  var initialBlockDataArray = {};

  this.addWebSocketOnOpenCallback = function(callback){
    webSocketOnOpenCallbacks.push(callback);
    console.log(webSocketOnOpenCallbacks);
  };

  this.addWebSocketOnCloseCallback = function(callback){
    webSocketOnCloseCallbacks.push(callback);
  };


  /* Adding generic callbacks for 'get' requests which have no channel id */

  var genericSuccessCallback = null;
  var genericFailureCallback = null;

  this.setGenericSuccessCallback = function(callback){
    genericSuccessCallback = callback;
  };

  this.setGenericFailureCallback = function(callback){
    genericFailureCallback = callback;
  };

  this.getNextAvailableId = function(){
    return channelIDIndex;
  };

  this.incrementId = function(){
    channelIDIndex += 1;
  };

  this.sendText = function(message){
    console.log(message);
    websocket.send(message);

    /* Pretty sure I'm not doing the callback thing right, but hey ho this is the best I got so far =P */
    //this.addOnServerMessageCallback(callback);
    //this.addWebSocketOnErrorCallback(callback);
    /* UPDATE: use the type attribute of the response message instead of callbacks! */
  };

  this.close = function(){
    websocket.close();
  };

  //this.addOnServerMessageCallback = function(callback){
  //  onServerMessageCallbacks.push(callback);
  //};
  //
  //this.addWebSocketOnErrorCallback = function(callback){
  //  webSocketOnErrorCallbacks.push(callback);
  //};

  this.addWebSocketOnOpenCallback = function(callback){
    webSocketOnOpenCallbacks.push(callback);
  };

  openWebSocket(url);

  function openWebSocket(url){

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
      //fireOnOpen(evt);
      for(var i in webSocketOnOpenCallbacks){
        webSocketOnOpenCallbacks[i](evt)
      }
      console.log("websocket has been opened")
    };

    websocket.onmessage = function(evt){ /* I think all these methods with websocket.method are associated/builtin in WebSockets */
      //console.log("message has been received from server via websocket");
      var json;
      json = JSON.parse(evt.data);
      console.log("Here is the event:");
      console.log(evt);

      /* Time to check which channel callback to invoke based on the type! */
      //console.log(json.type);

      /* First check if that channel id exists, if not then run the generic
      callbacks
       */
      /* UPDATE: no need for channel objects I don't think, I have
      the lookup table now? Or is it that I still wanna use that for subscription/monitor
      purposes?
       */
      if(channelObject[json.id] === undefined){
        //console.log("channel doesn't exist/isn't subscribed, so invoke generic callback");
        if(json.type === 'Error'){
          //genericFailureCallback(json);
          console.log(json);
          idLookupTableFunctions.invokeIdCallback(json.id, false, json.message);
        }
        else if(json.type === 'Return'){
          /* Bad to do, trying something else */
          //if(json.value.descriptor === 'Child block names'){
          //  initialBlockDataArray = JSON.parse(JSON.stringify(json.value.value));
          //  console.log("initial block list, so need to do another call to fetch all block info?!")
          //  for(var i = 0; i < json.value.value.length; i++){
          //
          //    /* Send a get request for all blocks in the initial block array */
          //    clientSelf.sendText(
          //      JSON.stringify(
          //        {type: 'Get', id: 0, endpoint: String(json.value.value[i])}
          //      )
          //    );
          //  }
          //}
          //
          //if(json.value.tags !== undefined && json.value.tags[0] === "instance:Zebra2Block" &&
          //  json.value.tags[1] === "instance:Device" ) {
          //
          //    /* Check the 'visibility' attribute of a block to see if
          //    it should be shown in thr GUI
          //     */
          //    /* Use this to add just one or two blocks to test with,
          //    rather than the whole list of 89 of them =P
          //     */
          //  //if(json.value.name === "Z:CLOCKS" || json.value.name === "Z:PULSE1") {
          //
          //    var blockName = JSON.parse(JSON.stringify(json.value.name.slice(2)));
          //    blockData[blockName] = JSON.parse(JSON.stringify(json.value.attributes));
          //    //console.log(blockData);
          //    if (json.value.name === initialBlockDataArray[initialBlockDataArray.length - 1]) {
          //      /* Once all initial blocks are fetched, send the blockData object to the client */
          //      console.log("ready to send the object containing all the block data!");
          //      genericSuccessCallback(blockData);
          //    }
          //  //}
          //
          //}

          /* Invoking the corresponding id's callback */
          console.log(json);
          idLookupTableFunctions.invokeIdCallback(json.id, true, json.value);

        }
      }
      else {
        if (json.type === 'Error') {
          /* Will replace soon with lookup table invoke instead */
          channelObject[json.id].failureCallback(json);
        }
        else if (json.type === 'Return') {
          /* Will replace soon with lookup table invoke instead */
          channelObject[json.id].successCallback(json);
        }
      }
    };

    websocket.onerror = function(evt){  /* This is the only thing that invokes fireOnError I think */
      //fireOnError(evt);
      console.log("webocket error");
      console.log(evt);
    };

    websocket.onclose = function(evt){
      //fireOnClose(evt);
      console.log("websocket has been closed")
    };


  }







  this.subscribeChannel = function(name, callback, readOnly){
    var typeJson; /* Not entirely sure what this is doing, it's creating a variable without a value? */
    /* Yep, it implicitly is a variable of type 'undefined'; it's usually used to declare variables for later use */

    /* what the subscribe message should look like */
    //'{"type" : "Subscribe", "id" : ' + idSub + ', "endpoint" : "' + channelSub + '"}';

    var json = '{"type" : "Subscribe", "id" : ' + channelIDIndex + ', "endpoint" : "' + name + '"}';

    console.log(json);

    var channel = new Channel(name); /* Creating a new channel, with its name attribute set as the input argument; note that the variable is called 'channel' though for ALL channels subscribed */ /* Also, not sure if it matters, but the other 'name' arguments above highlight as well when I hover over this argument? Are they connected? */
    /* Haha, yep, they are connected, since this is all within one function, subscribeChannel()! :P */
    channelObject[channelIDIndex] = channel; /* For whatever value/number/index channelIDIndex is, that index gets the value of this new channel */
    channel.id = channelIDIndex;
    channel.name = name;
    channel.readOnly = readOnly;
    channel.connected = true;

    //this.sendText(json, function(){console.log("send json to server")});
    //console.log(channelObject);



    channel.channelCallback = callback;
    channelIDIndex++; /* Shorthand for incrementing channelIDIndex by one (happens each time the whole function subscribeChannel() gets called) */
    /* Oh, so this is what prevents each channel from having the same id, the number inside the variable channelIDIndex is simply just to get it started, it's not used to keep track of every channel and its corresponding index, */
    /* I suppose it's used to count how many channels there actually are */
    return channel;
  };







  /* Channel constructor function */

  function Channel(name){ /* Hmm, not sure the best way to get this to have state... */

    this.name = name;
    this.id = -1;   /* Look at the docs and their definition of getId, getValue: it says that they can have any data type, hence they can be strings, numbers, floats, objects etc */
    this.value = null;
    this.channelCallback = null; /* not sure why this gets 'unused definition' and the others don't? */ /* Update: it doesn't now, maybe it changed? */
    this.connected = false;
    this.readOnly = true;
    /* Adding successCallback and failureCallback */
    this.successCallback = null;
    this.failureCallback = null;

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

    //this.fireChannelEventFunc = function(json){
    //  console.log("firChanneklEventFunc is about to invoke processJsonForChannel, the thing that actually changes Channel attribute values!");
    //  processJsonForChannel(json, this);  /* The only thing that invokes processJsonForChannel */
    //  this.channelCallback(json, this); /* I suppose channelCallback is just a function that lets you know that
    //   fireChannelEventFunc has occurred/ran (a console log will probably suffice)
    //   Furthermore, since the inputs are 'this' and 'json', I guess it's pointing
    //   to you logging which channel the info is travelling across, and what the info
    //   travelling across is*/
    //};

  }


  function unsubscribe(channelIDIndex){
    console.log("unsubscribing a channel");
    //console.log("the following is an update on channelArray");
    //console.log(channelArray);
    var json = JSON.stringify({
      "message": "unsubscribe",
      "id": channelIDIndex
    });

    clientSelf.sendText(json);
    delete channelObject[channelIDIndex]; /* delete sets the desired object as undefined instead of removing, and also doesn't shorten the array length? */
    //channelArray.splice(channelIDIndex,1);
    //console.log(channelArray);
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

  /* Add function to set any channel's successCallback and failureCallback */

  function setChannelSuccessCallback(channelID, callback){
    channelObject[channelID].successCallback = callback;
  }

  function setChannelFailureCallback(channelID, callback){
    channelObject[channelID].failureCallback = callback;
  }






}

//var FluxWebSocketClient = new Client('ws://pc0013.cs.diamond.ac.uk:8080/ws');
//module.exports = Client;
var WebSocketClient = new Client('ws://localhost:8080/ws');
module.exports = WebSocketClient;
