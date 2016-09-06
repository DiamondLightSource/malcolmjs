import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import { storiesOf, action } from '@kadira/storybook';

function handleEdgeDeleteButton(){

  console.log("material-ui button clicked");

}

storiesOf('Button', module)
    .add('material-ui flat button', () => (
        <MuiThemeProvider  muiTheme={getMuiTheme(lightBaseTheme)}>

            <FlatButton key="edgeDeleteButton" className="pull-right btn btn-default" label="edge Delete Button"
                          onClick={handleEdgeDeleteButton()}>Delete Edge</FlatButton>
        </MuiThemeProvider>
  ))
    .add('material-ui raised button', () => (
        <MuiThemeProvider  muiTheme={getMuiTheme(darkBaseTheme)}>
            <RaisedButton key="edgeDeleteButton" className="pull-right btn btn-default" label="edgeDeleteButton"
                          onClick={action("Raised button clicked")}>Delete Edge</RaisedButton>
        </MuiThemeProvider>
    ))
    .add('material-ui Toggle switch', () => (
        <MuiThemeProvider  muiTheme={getMuiTheme(darkBaseTheme)}>
            <Toggle key="edgeToggleSwitch" className="pull-right btn btn-default" label="Edge Toggle"
                          onToggle={action("Toggle switch")}/>
        </MuiThemeProvider>
    ));

