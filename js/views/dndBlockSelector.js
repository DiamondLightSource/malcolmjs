/**
 * Created by Ian Gillingham on 28/04/17.
 *
 * @module dndBlockSelector
 * @description exports a React component which facilitates drag and drop of blocks from the available blocks list.
 * @author Ian Gillingham
 *
 */
import * as React from 'react';
import PropTypes from 'prop-types';
import {DragSource} from 'react-dnd';
import ItemTypes from './dndItemTypes';
import flowChartActions, {DroppedBlockInfo} from '../actions/flowChartActions';

const style = {
  border         : '1px dashed gray',
  backgroundColor: 'white',
  padding        : '0.5rem 1rem',
  marginRight    : '1.5rem',
  marginBottom   : '1.5rem',
  cursor         : 'move',
  float          : 'left',
};

const blockSource =
  {
  beginDrag(props)
    {
    const item = {name: props.name};
    return (item);
    },

  endDrag(props, monitor)
    {
    const item       = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if (dropResult)
      {
      let clientOffset = monitor.getSourceClientOffset();
      if (clientOffset === null)
        {
        clientOffset = {x:0,y:0};
        }

      let info = new DroppedBlockInfo(item, clientOffset);

      flowChartActions.dropBlockFromList(info);
      // We will need to trigger an action creator here
/*
      window.alert( // eslint-disable-line no-alert
        `You dropped ${item.name} into ${dropResult.name}!`,
      );
*/
      }
    },
  };


class DNDBlockSelector extends React.Component {
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
    isDragging       : monitor.isDragging(),
  };
  }

DNDBlockSelector.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging       : PropTypes.bool.isRequired,
  name             : PropTypes.string.isRequired,
};


export default DragSource(ItemTypes.BLOCK, blockSource, collect)(DNDBlockSelector);
