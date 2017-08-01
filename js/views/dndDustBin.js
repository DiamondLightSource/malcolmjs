/**
 * Created by Ian Gillingham on 28/04/17.
 */
import * as React from 'react';
import PropTypes from 'prop-types';
import DropTarget from 'react-dnd/lib/DropTarget';
import ItemTypes from './dndItemTypes';

const style = {
  height      : '12rem',
  width       : '12rem',
  marginRight : '1.5rem',
  marginBottom: '1.5rem',
  color       : 'white',
  padding     : '1rem',
  textAlign   : 'center',
  fontSize    : '1rem',
  lineHeight  : 'normal',
  float       : 'left',
};

const boxTarget = {
  drop() {
  return {name: 'Dustbin'};
  },
};

@DropTarget(ItemTypes.BOX, boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver           : monitor.isOver(),
  canDrop          : monitor.canDrop(),
}))
export default class Dustbin extends React.Component {
static propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  isOver           : PropTypes.bool.isRequired,
  canDrop          : PropTypes.bool.isRequired,
};

render()
  {
  const {canDrop, isOver, connectDropTarget} = this.props;
  const isActive                             = canDrop && isOver;

  let backgroundColor = '#222';
  if (isActive)
    {
    backgroundColor = 'darkgreen';
    }
  else if (canDrop)
    {
    backgroundColor = 'darkkhaki';
    }

  return connectDropTarget(
    <div style={{...style, backgroundColor}}>
      {isActive ?
        'Release to drop' :
        'Drag a box here'
      }
    </div>,
  );
  }
}
