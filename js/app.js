/**
 * Created by twi18192 on 25/08/15.
 */

var React = require('react');
var ReactDOM = require('react-dom');
var ReactPanels = require('react-panels');
var WebSocketClient = require('./websocketClient');
var testingWebsocketActions = require('./actions/testingWebsocketActions');

var MainPane = require('./views/mainPane');
var SidePane = require('./views/sidePane');
var BothPanes = require('./views/sidebar');

var blockStore = require('./stores/blockStore.js');

var AppContainerStyle = {
  margin: 0,
  padding: 0,
  display: 'flex',
  "height": "100%",
  "width": "100%"
};

var MainTabbedViewStyle = {
  "height": "100%",
  "width": "100%",
  minWidth: 200,
  minHeight: 500,
  display: 'inlineBlock'
};

var SideTabbedViewStyle = {
  float: 'right',
  "height": "100%",
  "width": "100%",
  maxWidth:400
};

function getAppState(){
  return {
    initialBlockStringArray: JSON.parse(JSON.stringify(blockStore.getAllBlockInfoForInitialBlockData())),
  }
}

var App = React.createClass({

  //getInitialState: function(){
  //  this.setState(getAppState());
  //},

  componentDidMount: function(){
    testingWebsocketActions.testAddWebsocketOnOpenCallback();
    /* Perhaps use the newly fetched initial data to subscribe channels for
     them all? */
    //console.log("getting blocks now!");
    //for(var i = 0; i < JSON.parse(JSON.stringify(blockStore.getAllBlockInfoForInitialBlockData())).length; i++){
    //  testingWebsocketActions.testFetchEveryInitialBlockObject(
    //    JSON.parse(JSON.stringify(blockStore.getAllBlockInfoForInitialBlockData()[i])));
    //}
    //testingWebsocketActions.testFetchEveryInitialBlockObject(
    //  JSON.parse(JSON.stringify(blockStore.getAllBlockInfoForInitialBlockData()[0]))
    //)

  },

  render: function(){
    console.log("render: app");
    return(
      <div id="appContainer" style={AppContainerStyle}>
        <BothPanes/>
      </div>
    )
  }
});

ReactDOM.render(
  <App/>,
  document.getElementById('container')
);

//<div id="MainTabbedView" style={MainTabbedViewStyle}><MainPane/></div>
//<div id="SideTabbedView" style={SideTabbedViewStyle}><SidePane/></div>
