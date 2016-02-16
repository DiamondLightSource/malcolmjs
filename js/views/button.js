/**
 * Created by twi18192 on 16/02/16.
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

var Button = React.createClass({

  render: function() {
    return(
      <div>
        <div id={this.props.buttonId} style={ButtonStyle} onClick={this.props.buttonClick} >
          <span style={ButtonTitlePadding}>{this.props.buttonLabel}</span>
        </div>

      </div>
    )}
});

module.exports = Button;
