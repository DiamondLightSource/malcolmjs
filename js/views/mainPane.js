/**
 * Created by twi18192 on 25/08/15.
 */

var React = require('react');
var ReactPanels = require('react-panels');
var mainPaneStore = require('../stores/mainPaneStore');
var mainPaneActions = require('../actions/mainPaneActions');
var ConfigButton = require('./configButton');
var FavButton = require('./favButton');
var RedBlock = require('./redBlock');
var BlueBlock = require('./blueBlock');
var GreenBlock = require('./greenBlock');

//var SidePane = require('./sidePane');
//var sidePaneActions = require('../actions/sidePaneActions');
//var sidePaneStore = require('../stores/sidePaneStore'); /*not sure if this is allowed, but I'll give it a whirl :P*/

var paneStore = require('../stores/paneStore');
var paneActions = require('../actions/paneActions');

var deviceStore = require('../stores/deviceStore');
var deviceActions = require('../actions/deviceActions');

var WebSocketClient = require('../websocketClientTEST');
var sessionActions = require('../actions/sessionActions');

var TheGraphDiamond = require('./theGraphDiamond.js');
//var TheGraphDiamond = require('../the-graph-diamond/js/app.js');

var nodeStore = require('../stores/nodeStore.js');
var nodeActions = require('../actions/nodeActions.js');

//var FlexboxTheme = require('./reactPanelsCustomTheme.js');

var Panel = ReactPanels.Panel;
var Tab = ReactPanels.Tab;
var Toolbar = ReactPanels.Toolbar;
var Content = ReactPanels.Content;
var Footer = ReactPanels.Footer;
var ToggleButton = ReactPanels.ToggleButton;
var Button = ReactPanels.Button;

function getMainPaneState(){
  return {
    footers: mainPaneStore.getFooterState(),
    configPanelOpen: mainPaneStore.getConfigPanelState(),
    favPanelOpen: mainPaneStore.getFavPanelState(),
    redBlockPropertiesClicked: paneStore.getRedBlockTabClicked(),
    blueBlockPropertiesClicked: paneStore.getBlueBlockTabClicked(),
    greenBlockPropertiesClicked: paneStore.getGreenBlockTabClicked(),
    favTabOpen: paneStore.getFavTabOpen(),
    configTabOpen: paneStore.getConfigTabOpen(),

    updatedRedBlockContentFromServer: deviceStore.getRedBlockContent(),
    updatedBlueBlockContentFromServer: deviceStore.getBlueBlockContent(),
    updatedGreenBlockContentFromServer: deviceStore.getGreenBlockContent(),
  }
}

var MainPane = React.createClass({

  getInitialState: function(){
    return getMainPaneState(); /* can just return the function that updates state when _onChange runs, rather than retyping the whole thing!*/
  },

  _onChange: function(){
    this.setState(getMainPaneState(), function(){
      console.log("mainpane's state has been mutated");
    })
  },

  handleActionFooterToggle: function(){     /* this is what the footer toggle button needs to call when clicked!!*/
    mainPaneActions.toggleFooter1("this is the item")
  },

  handleActionAddTab: function(stuff){
    paneActions.addTab(stuff)
  },

  handleActionPassDispatchMarker: function(selectedObject){
    var selectedObject = selectedObject;
    var selectedDispatchMarker = selectedObject.dispatchMarker;
    console.log(selectedDispatchMarker);
    paneActions.passDispatchMarker(selectedDispatchMarker)
  },

  //handleActionAppendStuffForNewBlock: function(selectedObject){
  //
  //},

  handleActionChangeSomeInfo: function(){
    paneActions.changeSomeInfo('this is the item')
  },

  handleActionMockServerRequest: function(){
    deviceActions.mockServerRequest('this is the item');
    console.log('new block content has been transferred to MainPane, now invoking action to pass to paneStore');
    paneActions.updatePaneStoreBlockContentViaDeviceStore(this.state.updatedRedBlockContentFromServer);
    paneActions.updatePaneStoreBlockContentViaDeviceStore(this.state.updatedBlueBlockContentFromServer);
    paneActions.updatePaneStoreBlockContentViaDeviceStore(this.state.updatedGreenBlockContentFromServer);
  },

  handleActionFavTabOpen: function(){
    console.log('favTabOpen is a go');
    paneActions.favTabOpen("this is the item")
  },

  handleActionConfigTabOpen: function(){
    console.log('configTabOpen is a go');
    paneActions.configTabOpen('this is the item')
  },

  //handleActionTabChangeViaOtherMeans: function(tab){
  //  sidePaneActions.switchTabWhenTabOpens(tab)
  //},

  componentDidMount: function(){
    mainPaneStore.addChangeListener(this._onChange);
    paneStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    mainPaneStore.removeChangeListener(this._onChange);
    paneStore.removeChangeListener(this._onChange);
  },

  addDivToContent: function(selectedObject){
    var selectedObject = selectedObject;
    var selectedDispatchMarker = selectedObject.dispatchMarker;
    console.log(selectedObject);
    console.log(selectedObject.dispatchMarker);

    function getRandomColor() {
      var letters = '0123456789ABCDEF'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    var YES = document.createElement('DIV');

    YES.addEventListener("click", function(){
      console.log(selectedObject);/* selectedObject has now changed, that's the problem here!*/
      console.log(selectedObject.dispatchMarker);
      //var selectedObject = selectedObject;
      //var selectedDispatchMarker = selectedObject.dispatchMarker;
      console.log(selectedDispatchMarker);
      paneActions.appendStuffForNewBlock(selectedDispatchMarker);
    });
    YES.style.cssText = 'height: 100px; width: 100px; margin-top: 10px; margin-bottom: 10px; ';
    YES.style.backgroundColor = getRandomColor();
    //YES.setAttribute('draggable', 'true'); No need for this anymore!
    //YES.id = selectedObject;

    var testDivStyling = {
      float: 'right',
      backgroundColor: "magenta",
      height: 100,
      width: 100,
      marginTop: 10,
      marginBottom: 10
    };
    var ComeOn = React.createClass({render: function(){ /* around here is where I would need to generate a new object in the 'Block' class via a constructor*/
      return(
        <div></div>
      )
    }});
    //ComeOn.id = "meh";
    //document.getElementById('TEST').appendChild(comeOn)
    React.render(<ComeOn style={testDivStyling}/>, document.getElementById('TEST').appendChild(YES));
    console.log(ComeOn)
  },





  //testingChannelUnsubscription: function(){
  //  //console.log("checking state of websocket connection:");
  //  //WebSocketClient.checkStateOfWebSocketConnection();
  //  //console.log("seeing what WebSocket.getchannel(0) returns");
  //  //console.log(WebSocketClient.getChannel(0));
  //  //console.log("getting channel 0, seeing if it's undefined");
  //  WebSocketClient.getChannel(0).unsubscribe();
  //
  //  //WebSocketClient.getAllChannels()
  //
  //},
  //
  //testingChannelResubscription: function(){
  //  WebSocketClient.resubscribeChannel(0);
  //},
  //
  //testingChannelValueType: function(){
  //  var testChannel = WebSocketClient.getChannel(0);
  //  testChannel.setValue({test: "Test"});
  //  console.log(testChannel.getValue());
  //  testChannel.channelValueType()
  //},
  //
  //testingChannelPause: function(){
  //  var testChannel = WebSocketClient.getChannel(0);
  //  console.log("Attempting to pause the channel");
  //  testChannel.pause()
  //},
  //
  //testingChannelSetValue: function(){
  //  var testChannel = WebSocketClient.getChannel(0);
  //  console.log("Attempting to use Channel.setValue");
  //  testChannel.setValue(2);
  //  //console.log("Hopefully the value of the Channel has changed, let's see:");
  //  //console.log(testChannel.getValue())
  //  //Doesn't work, it runs before the server responds!
  //
  //},

  testingAddChannelChangeInfoViaProperServerRequest: function(){
    sessionActions.properServerRequestToAddChannelChangeInfoTest("this is the item");
    //console.log('new block content has been transferred to MainPane, now invoking action to pass to paneStore');
    //paneActions.updatePaneStoreBlockContentViaDeviceStore(this.state.updatedRedBlockContentFromServer);
    //paneActions.updatePaneStoreBlockContentViaDeviceStore(this.state.updatedBlueBlockContentFromServer);
    //paneActions.updatePaneStoreBlockContentViaDeviceStore(this.state.updatedGreenBlockContentFromServer);
  },

  addGateNode: function(){
    nodeActions.addToAllNodeInfo("adding gate node");

  },



  render: function() {
    var TESTStyling = {
      height: 1000,
      width: 1000,
      //backgroundColor: 'darkmagenta'
    };

    var contentStyling = {
      'height': '1476',
      'width': '1494'
    };
    //console.log(this.state.newlyAddedNode);
    //console.log(this.state);
    return(
      <Panel theme="flexbox" useAvailableHeight={true} buttons={[
          <ToggleButton title="Toggle Footer" onChange={this.handleActionFooterToggle}>
            <i className="fa fa-wrench"></i>
          </ToggleButton>
        ]}>
        <Tab title="View" showFooter={this.state.footers}>
          <Content  >
            <div style={contentStyling} >
              <TheGraphDiamond />
            </div>





          </Content>

          <Footer><div id="blockDock">
            <div id="buttonContainer">
              <FavButton favTabOpen={this.handleActionFavTabOpen}/>
              <ConfigButton configTabOpen={this.handleActionConfigTabOpen}/>
              <button type="button" onClick={this.addDivToContent}>Add block</button>
              <button type="button" onClick={this.testingAddChannelChangeInfoViaProperServerRequest}>Proper server request</button>
              <button type="button" onClick={this.addGateNode}>Add node</button>

            </div>
          </div>
          </Footer>
        </Tab>

        <Tab title="Design" showFooter={this.state.footers}>
          <Content>Secondary main view - graph of position data <br/>
            Contains a graph of the current position data, also has some buttons at the bottom to launch subscreens <br/>
            <p>Config panel is {this.state.configTabOpen ? 'open' : 'closed'}</p>

            <div className={this.state.configTabOpen ? "border" : ""}></div>

            <p>Fav panel is {this.state.favTabOpen ? 'open' : 'closed'}</p>

          </Content>
          <Footer><div id="blockDock">
            <div id="buttonContainer">
              <FavButton favTabOpen={this.handleActionFavTabOpen}/>
              <ConfigButton configTabOpen={this.handleActionConfigTabOpen}/>
            </div>
          </div>
          </Footer>
        </Tab>
      </Panel>
    )
  }
});

module.exports = MainPane;

//handleActionChangeRedBlockState: function(){
//  sidePaneActions.redBlockStateChange("this is the item")
//},

//showObjectProperties: function(selectedObject){
//  console.log(selectedObject);
//  var objectProperties = selectedObject; /* currently the div that contains the object, not the actual React component*/
//  console.log("something is happening");
//  if(this.state.redBlockPropertiesClicked === true){
//    console.log("if statement");
//    return objectProperties
//  }
//  else{
//    console.log("else statement");
//    return "uihy"
//  }
//},

//changeClickedObjectProperties: function(selectedObject){ /*replaced by handleActionPassDispatchMarker*/
//  var selectedObject = selectedObject;
//  var selectedDiv = selectedObject.target;
//  var selectedDispatchMarker = selectedObject.dispatchMarker;
//  console.log(selectedObject);
//  console.log(selectedDiv);
//  console.log(selectedDispatchMarker);
//
//  switch(selectedDispatchMarker){
//    case '.0.0.0.1.$tabb-0.$=1$=010=2$0.0.0.1':
//          //this.setState({redBlockPropertiesClicked: true}); /*need a separate handleAction for each block most likely*/
//      this.handleActionRedBlockPropertiesClicked();
//      //this.handleActionTabChangeViaOtherMeans('Red block');
//      var tabToAdd = "RedBlock";
//      //sidePaneActions.redBlockTabOpen();
//          break;
//    case '.0.0.0.1.$tabb-0.$=1$=010=2$0.0.0.2':
//          //this.setState({blueBlockPropertiesClicked: true});
//      this.handleActionBlueBlockPropertiesClicked();
//      //this.handleActionTabChangeViaOtherMeans('Blue block');
//      var tabToAdd = "BlueBlock";
//          break;
//    case '.0.0.0.1.$tabb-0.$=1$=010=2$0.0.0.3':
//          //this.setState({greenBlockPropertiesClicked: true});
//      this.handleActionGreenBlockPropertiesClicked();
//      //this.handleActionTabChangeViaOtherMeans('Green block');
//      var tabToAdd = "GreenBlock";
//          break;
//
//    default:
//          return 'default'
//  }
//
//  //this.handleActionAddTab(tabToAdd);
//
//  console.log(tabToAdd);
//  //console.log(this.state.redBlockPropertiesClicked);
//
//  //this.setState({objectPropertiesClicked: true});
//
//  //var selectedObjectProperties = redBlock.name; not sure if needed, can access the redBlock object simply through the imported module
//  //this.showObjectProperties(selectedObject) /*use it to pass the clicked block object info to the showObjectProperties function*/
//},


