/**
 * Created by twi18192 on 25/08/15.
 */

let React    = require('react');
let ReactDOM = require('react-dom');

//import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

//let WebSocketClient = require('./wsWebsocketClient');
//let testingWebsocketActions = require('./actions/testingWebsocketActions');

let BothPanes = require('./views/sidebar');


let AppContainerStyle = {
  margin  : 0,
  padding : 0,
  display : 'flex',
  "height": "100%",
  "width" : "100%"
};

let MainTabbedViewStyle = {
  "height" : "100%",
  "width"  : "100%",
  minWidth : 200,
  minHeight: 500,
  display  : 'inlineBlock'
};

let SideTabbedViewStyle = {
  float   : 'right',
  "height": "100%",
  "width" : "100%",
  maxWidth: 400
};

let App = React.createClass({

  componentDidMount: function ()
    {

    },

  render: function ()
    {
    return (
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
