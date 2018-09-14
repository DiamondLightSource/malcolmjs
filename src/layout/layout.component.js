import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DiagramWidget } from 'storm-react-diagrams';
import navigationActions from '../malcolm/actions/navigation.actions';
import {
  malcolmSelectBlock,
  malcolmLayoutUpdatePosition,
  malcolmPutAction,
  malcolmSetFlag,
} from '../malcolm/malcolmActionCreators';
import layoutAction, { selectPort } from '../malcolm/actions/layout.action';

require('storm-react-diagrams/dist/style.min.css');

export const idSeparator = '•';
const deleteKeys = {
  Delete: 46,
  Backspace: 8,
};

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasFocus: false };
  }
  componentDidMount() {
    const layoutDiv = document.getElementById('LayoutDiv');
    if (layoutDiv !== null) {
      layoutDiv.addEventListener('wheel', event => {
        if (event.deltaMode === event.DOM_DELTA_LINE) {
          event.stopPropagation();
          const customScroll = new WheelEvent('wheel', {
            bubbles: event.bubbles,
            deltaMode: event.DOM_DELTA_PIXEL,
            clientX: event.clientX,
            clientY: event.clientY,
            deltaX: event.deltaX,
            deltaY: 10 * event.deltaY,
          });
          event.target.dispatchEvent(customScroll);
        }
      });
    }
  }

  render() {
    this.props.layoutEngine.selectedHandler = this.props.selectHandler;
    this.props.layoutEngine.clickHandler = this.props.clickHandler;
    this.props.layoutEngine.mouseDownHandler = this.props.mouseDownHandler;
    this.props.layoutEngine.portMouseDown = this.props.portMouseDown;
    return (
      <div
        id="LayoutDiv"
        tabIndex="-1"
        onDrop={event =>
          this.props.makeBlockVisible(event, this.props.layoutEngine)
        }
        onDragOver={event => event.preventDefault()}
        onMouseUp={() => this.props.mouseDownHandler(false)}
        onKeyUp={event => {
          if (
            Object.keys(deleteKeys).includes(event.key) &&
            this.state.hasFocus
          ) {
            this.props.deleteBlock(this.props.selectedBlocks);
          }
        }}
        onFocus={() => {
          this.setState({ hasFocus: true });
        }}
        onBlur={() => {
          this.setState({ hasFocus: false });
        }}
        role="presentation"
        style={{
          display: 'flex',
          position: 'relative',
          width: '100%',
          height: '100%',
          opacity: 0.9,
        }}
      >
        <DiagramWidget
          diagramEngine={this.props.layoutEngine}
          // smartRouting
          maxNumberPointsPerLink={0}
          inverseZoom
          deleteKeys={this.state.hasFocus ? Object.values(deleteKeys) : []}
        />
      </div>
    );
  }
}

Layout.propTypes = {
  layoutEngine: PropTypes.shape({
    selectedHandler: PropTypes.func,
    clickHandler: PropTypes.func,
    portMouseDown: PropTypes.func,
    mouseDownHandler: PropTypes.func,
  }).isRequired,
  selectHandler: PropTypes.func.isRequired,
  clickHandler: PropTypes.func.isRequired,
  portMouseDown: PropTypes.func.isRequired,
  makeBlockVisible: PropTypes.func.isRequired,
  mouseDownHandler: PropTypes.func.isRequired,
  deleteBlock: PropTypes.func.isRequired,
  selectedBlocks: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export const mapStateToProps = state => ({
  layoutEngine: state.malcolm.layoutEngine,
  selectedBlocks: state.malcolm.layoutState.selectedBlocks,
});

let showBinTimeout = null;

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
    if (show) {
      showBinTimeout = setTimeout(
        () => dispatch(layoutAction.showLayoutBin(show)),
        200
      );
    } else {
      if (showBinTimeout) {
        clearTimeout(showBinTimeout);
        showBinTimeout = null;
      }
      dispatch(layoutAction.showLayoutBin(show));
    }
  },
  selectHandler: (type, id, isSelected) => {
    if (type === 'malcolmjsblock') {
      dispatch(malcolmSelectBlock(id, isSelected));
    } else if (type === 'malcolmlink' && isSelected) {
      const idComponents = id.split(idSeparator);
      const blockMri = idComponents[2];
      const portName = idComponents[3];
      dispatch(navigationActions.updateChildPanelWithLink(blockMri, portName));
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

  deleteBlock: blockMriList => {
    dispatch(
      layoutAction.makeBlockVisible(
        blockMriList,
        blockMriList.map(() => ({ x: 0, y: 0 })),
        blockMriList.map(() => false)
      )
    );
  },

  putValueHandler: (path, value) => {
    dispatch(malcolmSetFlag(path, 'pending', true));
    dispatch(malcolmPutAction(path, value));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
