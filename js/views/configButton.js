/**
 * Created by twi18192 on 25/08/15.
 */

let React = require('react');
let mainPaneStore = require('../stores/mainPaneStore');
let mainPaneActions = require('../actions/mainPaneActions');

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

let ConfigButton = React.createClass({
  //getInitialState: function(){
  //  return getConfigButtonState();
  //},

  //_onChange: function(){
  //  this.setState(getConfigButtonState)
  //},

  propTypes: {
    configTabOpen      : React.PropTypes.func
  },

  handleActionConfigToggle:function(){
    mainPaneActions.toggleConfigPanel("this is the item");
    this.props.configTabOpen()
  },

  componentDidMount: function(){
    //mainPaneStore.addChangeListener(this._onChange)
  },

  componentWillUnmount: function(){
    //mainPaneStore.removeChangeListener(this._onChange)
  },

  render: function() {
    return(
      <div>
        <div id="config" style={ButtonStyle} onClick={this.handleActionConfigToggle} ><span style={ButtonTitlePadding}>Config</span>


        </div>

      </div>
    )}
});

module.exports = ConfigButton;
