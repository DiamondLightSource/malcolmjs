/**
 * Created by twi18192 on 25/08/15.
 */

var React = require('react');
var ReactDOM = require('react-dom');
var ReactPanels = require('react-panels');
var WebSocketClient = require('./websocketClient');

var MainPane = require('./views/mainPane');
var SidePane = require('./views/sidePane');
var BothPanes = require('./views/sidebar');

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
