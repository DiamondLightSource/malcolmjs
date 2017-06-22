/**
 * Created by twi18192 on 25/08/15.
 */
import  * as React from 'react';
import * as ReactDOM from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import BothPanes from './views/sidebar';
import {DragDropContextProvider} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import 'font-awesome/css/font-awesome.min.css';
import './styles/app.scss';

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

export default class MjsApp extends React.Component
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
    return (
      <MuiThemeProvider>
      <div id="appContainer" style={AppContainerStyle}>
        <DragDropContextProvider backend={HTML5Backend}>
        <BothPanes connectDropTarget={this.dummy} isOver={false} canDrop={false}/>
        </DragDropContextProvider>
      </div>
      </MuiThemeProvider>
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
  <MjsApp/>,
  document.getElementById('container')
);
//ReactDOM.render(React.createElement(App, null), document.getElementById('container'));

//<div id="MainTabbedView" style={MainTabbedViewStyle}><MainPane/></div>
//<div id="SideTabbedView" style={SideTabbedViewStyle}><SidePane/></div>
