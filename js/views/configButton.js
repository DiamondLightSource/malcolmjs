/**
 * Created by twi18192 on 25/08/15.
 */


import * as React from 'react';
import PropTypes from 'prop-types';
//import mainPaneStore from '../stores/mainPaneStore';
import mainPaneActions from '../actions/mainPaneActions';

let ButtonStyle = {
  backgroundColor: 'grey',
  height: 25,
  width: 70,
  borderRadius: 8,
  borderStyle:'solid',
  borderWidth: 1,
  borderColor: 'black',
  fontFamily: 'Verdana',
//    color: 'white',
  textAlign: 'center',
  display: 'inline-block',
  cursor: 'pointer',
  MozUserSelect: 'none',
  marginTop: '39px',
  marginLeft: '10px'

};

let ButtonTitlePadding = {
  position: 'relative',
  top: -6

};

//function getConfigButtonState(){
//  return {
//    configPanelOpen:mainPaneStore.getConfigPanelState()
//  }
//}

export default class ConfigButton extends React.Component
{
constructor(props)
  {
    super(props);
  }

  handleActionConfigToggle()
    {
    mainPaneActions.toggleConfigPanel("this is the item");
    this.props.configTabOpen()
    }

  componentDidMount()
    {
    //mainPaneStore.addChangeListener(this._onChange)
    }

  componentWillUnmount()
    {
    //mainPaneStore.removeChangeListener(this._onChange)
    }

  render() {
    return(
      <div>
        <div id="config" style={ButtonStyle} onClick={this.handleActionConfigToggle} ><span style={ButtonTitlePadding}>Config</span>


        </div>

      </div>
    )}
}

ConfigButton.propTypes = {
configTabOpen      : PropTypes.func
};

