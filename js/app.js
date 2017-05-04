/**
 * Created by twi18192 on 25/08/15.
 */
import  * as React from 'react';
import * as ReactDOM from 'react-dom';

//import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

//let WebSocketClient = require('./wsWebsocketClient');
//let testingWebsocketActions = require('./actions/testingWebsocketActions');

import BothPanes from './views/sidebar';
//import {DragDropContextProvider} from 'react-dnd';
//import HTML5Backend from 'react-dnd-html5-backend';


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

export default class App extends React.Component
  {
  constructor(props)
    {
      super(props);
      this.dummy = this.dummy.bind(this);
    }

  componentDidMount()
    {
    }

  dummy()
    {

    }

  render()
    {
    /* Either side of BothPanes :*/
      /* <DragDropContextProvider backend={HTML5Backend}> */
      /* </DragDropContextProvider> */
    return (
      <div id="appContainer" style={AppContainerStyle}>
        <BothPanes connectDropTarget={this.dummy} isOver={false} canDrop={false}/>
      </div>
    )
    }
  }

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
//ReactDOM.render(React.createElement(App, null), document.getElementById('container'));

//<div id="MainTabbedView" style={MainTabbedViewStyle}><MainPane/></div>
//<div id="SideTabbedView" style={SideTabbedViewStyle}><SidePane/></div>
