/**
 * Created by twi18192 on 16/02/16.
 */

import * as React from 'react';
import PropTypes from 'prop-types';

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

export default class Button extends React.Component
{
  constructor(props)
    {
    super(props);

    }
  render()
    {
    return (
      <div>
        <div id={this.props.buttonId} style={ButtonStyle} onClick={this.props.buttonClick}>
          <span style={ButtonTitlePadding}>{this.props.buttonLabel}</span>
        </div>

      </div>
    )
    }
}

Button.propTypes = {
buttonId   : PropTypes.string,
  buttonClick: PropTypes.func,
  buttonLabel: PropTypes.string,
};

