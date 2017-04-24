/**
 * Created by twi18192 on 16/02/16.
 */

let React           = require('react');

let ButtonStyle = {
  backgroundColor: 'grey',
  height         : 25,
  width          : 70,
  borderRadius   : 8,
  borderStyle    : 'solid',
  borderWidth    : 1,
  borderColor    : 'black',
  fontFamily     : 'Verdana',
  //    color: 'white',
  textAlign      : 'center',
  display        : 'inline-block',
  cursor         : 'pointer',
  MozUserSelect  : 'none',
  //position       : 'relative',
  marginTop      : '39px'

};

let ButtonTitlePadding = {
  position: 'relative',
  top     : -6

};

let Button = React.createClass({

  propTypes: {
    buttonId   : React.PropTypes.string,
    buttonClick: React.PropTypes.func,
    buttonLabel: React.PropTypes.string,
  },

  render: function ()
    {
    return (
      <div>
        <div id={this.props.buttonId} style={ButtonStyle} onClick={this.props.buttonClick}>
          <span style={ButtonTitlePadding}>{this.props.buttonLabel}</span>
        </div>

      </div>
    )
    }
});

module.exports = Button;
