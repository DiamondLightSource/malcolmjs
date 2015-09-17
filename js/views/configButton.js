/**
 * Created by twi18192 on 25/08/15.
 */

var React = require('react');
var mainPaneStore = require('../stores/mainPaneStore');
var mainPaneActions = require('../actions/mainPaneActions');

var ButtonStyle = {
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
  MozUserSelect: 'none'

};

var ButtonTitlePadding = {
  position: 'relative',
  top: -6

};

function getConfigButtonState(){
  return {
    configPanelOpen:mainPaneStore.getConfigPanelState()
  }
}

var ConfigButton = React.createClass({
  getInitialState: function(){
    return getConfigButtonState();
  },

  _onChange: function(){
    this.setState(getConfigButtonState)
  },

  handleActionConfigToggle:function(){
    mainPaneActions.toggleConfigPanel("this is the item")
  },

  componentDidMount: function(){
    mainPaneStore.addChangeListener(this._onChange)
  },

  componentWillUnmount: function(){
    mainPaneStore.removeChangeListener(this._onChange)
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
