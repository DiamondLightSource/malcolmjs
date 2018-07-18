import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DiagramWidget } from 'storm-react-diagrams';
import navigationActions from '../malcolm/actions/navigation.actions';
import {
  malcolmSelectBlock,
  malcolmLayoutUpdatePosition,
} from '../malcolm/malcolmActionCreators';
import layoutAction, { selectPort } from '../malcolm/actions/layout.action';

require('storm-react-diagrams/dist/style.min.css');

const Layout = props => {
  const updatedProps = props;
  updatedProps.layoutEngine.selectedHandler = props.selectHandler;
  updatedProps.layoutEngine.clickHandler = props.clickHandler;
  updatedProps.layoutEngine.mouseDownHandler = props.mouseDownHandler;
  updatedProps.layoutEngine.portMouseDown = props.portMouseDown;

  return (
    <div
      onDrop={event => props.makeBlockVisible(event, props.layoutEngine)}
      onDragOver={event => event.preventDefault()}
      style={{
        display: 'flex',
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      <DiagramWidget
        diagramEngine={props.layoutEngine}
        maxNumberPointsPerLink={0}
      />
    </div>
  );
};

Layout.propTypes = {
  layoutEngine: PropTypes.shape({
    selectedHandler: PropTypes.func,
    clickHandler: PropTypes.func,
    portMouseDown: PropTypes.func,
  }).isRequired,
  selectHandler: PropTypes.func.isRequired,
  clickHandler: PropTypes.func.isRequired,
  portMouseDown: PropTypes.func.isRequired,
  makeBlockVisible: PropTypes.func.isRequired,
  mouseDownHandler: PropTypes.func.isRequired,
};

Layout.defaultProps = {};

export const mapStateToProps = state => ({
  layoutEngine: state.malcolm.layoutEngine,
});

export const mapDispatchToProps = dispatch => ({
  clickHandler: (block, node) => {
    const translation = {
      x: node.x - block.position.x,
      y: node.y - block.position.y,
    };

    if (
      Math.abs(node.x - block.position.x) > 3 ||
      Math.abs(node.y - block.position.y) > 3
    ) {
      dispatch(malcolmLayoutUpdatePosition(translation));
    }

    dispatch(navigationActions.updateChildPanel(block.name));
  },
  mouseDownHandler: show => {
    dispatch(layoutAction.showLayoutBin(show));
  },
  selectHandler: (type, id, isSelected) => {
    if (type === 'malcolmjsblock') {
      dispatch(malcolmSelectBlock(id, isSelected));
    }
  },
  portMouseDown: (portId, start) => {
    dispatch(selectPort(portId, start));
  },
  makeBlockVisible: (event, engine) => {
    const blockMri = event.dataTransfer.getData('storm-diagram-node');
    const position = engine.getRelativeMousePoint(event);
    dispatch(layoutAction.makeBlockVisible(blockMri, position));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
