/**
 * Created by Ian Gillingham on 28/04/17.
 */
import * as React from 'react';
import PropTypes from 'prop-types';
import {DragSource} from 'react-dnd';
import ItemTypes from './dndItemTypes';

const style = {
  border         : '1px dashed gray',
  backgroundColor: 'white',
  padding        : '0.5rem 1rem',
  marginRight    : '1.5rem',
  marginBottom   : '1.5rem',
  cursor         : 'move',
  float          : 'left',
};

const boxSource = {
  beginDrag(props) {
  return {
    name: props.name,
  };
  },

  endDrag(props, monitor) {
  const item       = monitor.getItem();
  const dropResult = monitor.getDropResult();

  if (dropResult)
    {
    window.alert( // eslint-disable-line no-alert
      `You dropped ${item.name} into ${dropResult.name}!`,
    );
    }
  },
};


class DNDBlockSelector extends Component {
render()
  {
  const {isDragging, connectDragSource} = this.props;
  const {name}                          = this.props;
  const opacity                         = isDragging ? 0.4 : 1;

  return (
    connectDragSource(
      <div style={{...style, opacity}}>
        {name}
      </div>,
    )
  );
  }
}

function collect(connect, monitor)
  {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
        };
  }

DNDBlockSelector.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging       : PropTypes.bool.isRequired,
  name             : PropTypes.string.isRequired,
};


export default DragSource(ItemTypes.BOX, boxSource, collect)(DNDBlockSelector);
