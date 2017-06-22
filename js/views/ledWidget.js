/**
 * Created by twi18192 on 06/04/16.
 */

import * as React from 'react';
import PropTypes from 'prop-types';

export default class LEDWidget extends React.Component {
constructor(props)
  {
  super(props);
  }

shouldComponentUpdate(nextProps, nextState)
  {
  return (
    nextProps.blockAttributeValue !== this.props.blockAttributeValue
  )
  }

render()
  {
  return (

    <svg style={{width: '150px', height: '20px'}}>
      <circle r={"8"} className={"ledWidget" + (this.props.blockAttributeValue ? 'ON' : 'OFF')}
              transform={"translate(9, 11)"}/>
    </svg>

  )
  }
}

LEDWidget.propTypes = {
  blockAttributeValue: PropTypes.bool.isRequired,
  tabObject          : PropTypes.object
};