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
import DragSource from 'react-dnd/lib/DragSource';
import ItemTypes from './dndItemTypes';
import flowChartActions, {DroppedPaletteInfo} from '../actions/flowChartActions';
import {Chip} from 'material-ui';


let paletteSource =
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
              clientOffset = {x: 0, y: 0};
              }

            let info = new DroppedPaletteInfo(item, clientOffset);

            flowChartActions.dropPaletteFromList(info);
            // We will need to trigger an action creator here
            /*
             window.alert( // eslint-disable-line no-alert
             `You dropped ${item.name} into ${dropResult.name}!`,
             );
             */
            }
          },
      };


class DNDPaletteSelector extends React.Component {
render()
  {
  const {connectDragSource, name} = this.props;

  return (
    connectDragSource(
      <div>
        <Chip label={name}/>
      </div>
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

DNDPaletteSelector.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging       : PropTypes.bool.isRequired,
  name             : PropTypes.string.isRequired,
  key              : PropTypes.string
};


export default DragSource(ItemTypes.PALETTE, paletteSource, collect)(DNDPaletteSelector);
