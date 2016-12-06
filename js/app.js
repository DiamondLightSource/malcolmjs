/**
 * Created by twi18192 on 25/08/15.
 */

var React = require('react');
var ReactDOM = require('react-dom');

//import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

var ReactPanels = require('react-panels');
//var WebSocketClient = require('./wsWebsocketClient');
//var testingWebsocketActions = require('./actions/testingWebsocketActions');

var MainPane = require('./views/mainPane');
var SidePane = require('./views/sidePane'); // TODO: This is probably not needed here.
var BothPanes = require('./views/sidebar');

var blockStore = require('./stores/blockStore.js');

var AppDispatcher = require('./dispatcher/appDispatcher');
var appConstants = require('./constants/appConstants.js');

var MalcolmActionCreators = require('./actions/MalcolmActionCreators');

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

var App = React.createClass({

  componentDidMount: function(){

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

/*
const App = () => (
    <div id="appContainer" style={AppContainerStyle}>
        <BothPanes/>
    </div>
);
*/


ReactDOM.render(
  <App/>,
  document.getElementById('container')
);

//<div id="MainTabbedView" style={MainTabbedViewStyle}><MainPane/></div>
//<div id="SideTabbedView" style={SideTabbedViewStyle}><SidePane/></div>
