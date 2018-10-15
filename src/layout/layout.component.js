import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DiagramWidget } from 'storm-react-diagrams';
import navigationActions from '../malcolm/actions/navigation.actions';
import {
  malcolmSelectBlock,
  malcolmSelectLink,
  malcolmLayoutUpdatePosition,
  malcolmClearLayoutSelect,
} from '../malcolm/malcolmActionCreators';
import layoutAction, { selectPort } from '../malcolm/actions/layout.action';
import { hiddenLinkIdSeparator } from '../malcolm/reducer/layout/layout.reducer';

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
            deltaY: 100 * Math.sign(event.deltaY),
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
    this.props.layoutEngine.linkClickHandler = this.props.linkClickHandler;
    return (
      <div
        id="LayoutDiv"
        tabIndex="-1"
        onClick={() => this.props.layoutClickHandler()}
        onDrop={event =>
          this.props.makeBlockVisible(event, this.props.layoutEngine)
        }
        onDragOver={event => event.preventDefault()}
        onMouseUp={() => this.props.mouseDownHandler(false)}
        onKeyUp={event => {
          if (
            !this.props.locked &&
            Object.keys(deleteKeys).includes(event.key) &&
            this.state.hasFocus
          ) {
            this.props.deleteSelected();
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
        }}
      >
        <DiagramWidget
          diagramEngine={this.props.layoutEngine}
          // smartRouting
          maxNumberPointsPerLink={0}
          allowLooseLinks={false}
          inverseZoom
          deleteKeys={
            !this.props.locked && this.state.hasFocus
              ? Object.values(deleteKeys)
              : []
          }
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
    linkClickHandler: PropTypes.func,
  }).isRequired,
  selectHandler: PropTypes.func.isRequired,
  clickHandler: PropTypes.func.isRequired,
  portMouseDown: PropTypes.func.isRequired,
  makeBlockVisible: PropTypes.func.isRequired,
  mouseDownHandler: PropTypes.func.isRequired,
  deleteSelected: PropTypes.func.isRequired,
  linkClickHandler: PropTypes.func.isRequired,
  layoutClickHandler: PropTypes.func.isRequired,
  locked: PropTypes.bool.isRequired,
};

export const mapStateToProps = state => ({
  layoutEngine: state.malcolm.layoutEngine,
  locked: state.malcolm.layout && state.malcolm.layout.locked,
});

let showBinTimeout = null;

const movedInXOrY = (node, block, limit) =>
  Math.abs(node.x - block.position.x) > limit ||
  Math.abs(node.y - block.position.y) > limit;

export const mapDispatchToProps = dispatch => ({
  clickHandler: (block, node) => {
    if (!block.isHiddenLink) {
      const translation = {
        x: node.x - block.position.x,
        y: node.y - block.position.y,
      };

      if (movedInXOrY(node, block, 3)) {
        dispatch(malcolmLayoutUpdatePosition(translation));
      }

      dispatch((innerDispatch, getState) => {
        const state = getState().malcolm;
        const childPanelIsOpen = state.childBlock !== undefined;
        const multipleBlocksSelected =
          state.layoutState.selectedBlocks.length > 1;
        if (multipleBlocksSelected && childPanelIsOpen) {
          innerDispatch(navigationActions.updateChildPanel(''));
        } else if (
          !multipleBlocksSelected &&
          (!movedInXOrY(node, block, 3) || childPanelIsOpen)
        ) {
          innerDispatch(navigationActions.updateChildPanel(block.name));
        }
      });
    } else {
      dispatch((innerDispatch, getState) => {
        const state = getState().malcolm;
        const childPanelIsOpen = state.childBlock !== undefined;
        const multipleBlocksSelected =
          state.layoutState.selectedBlocks.length > 1;
        if (multipleBlocksSelected && childPanelIsOpen) {
          innerDispatch(navigationActions.updateChildPanel(''));
        } else if (!multipleBlocksSelected) {
          const idComponents = block.mri.split(hiddenLinkIdSeparator);
          const blockMri = idComponents[1];
          const portName = idComponents[2];
          dispatch(
            malcolmSelectLink(
              `${
                block.mri
              }${idSeparator}${idSeparator}${blockMri}${idSeparator}${portName}`,
              true
            )
          );
          dispatch(
            navigationActions.updateChildPanelWithLink(blockMri, portName)
          );
        }
      });
    }
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

      dispatch(selectPort(undefined, true));
    }
  },

  linkClickHandler: id => {
    const idComponents = id.split(idSeparator);
    const blockMri = idComponents[2];
    const portName = idComponents[3];
    dispatch(navigationActions.updateChildPanelWithLink(blockMri, portName));
  },
  layoutClickHandler: () => {
    dispatch(navigationActions.updateChildPanel(''));
    dispatch(malcolmClearLayoutSelect());
  },
  selectHandler: (type, id, isSelected) => {
    if (type === 'malcolmjsblock') {
      const checkId = id.split(hiddenLinkIdSeparator);
      if (!(checkId[0] === 'HIDDEN-LINK')) {
        dispatch(malcolmSelectBlock(id, isSelected));
      } else {
        dispatch(
          malcolmSelectLink(
            `${id}${idSeparator}${idSeparator}${checkId[1]}${idSeparator}${
              checkId[2]
            }`,
            isSelected
          )
        );
      }
    } else if (type === 'malcolmlink') {
      dispatch(malcolmSelectLink(id, isSelected));
    }
  },
  portMouseDown: (portId, start) => {
    dispatch(selectPort(portId, start));
  },
  makeBlockVisible: (event, engine) => {
    const blockMri = event.dataTransfer.getData('storm-diagram-node');
    const position = engine.getRelativeMousePoint(event);
    // Other items can be dropped onto the layout;
    // prevent them from triggering the dispatch
    if (blockMri !== '') {
      dispatch(layoutAction.makeBlockVisible(blockMri, position));
      // close the palette after an item is dropped on to the layout
      dispatch(navigationActions.updateChildPanel(''));
    }
  },

  deleteSelected: () => {
    dispatch(layoutAction.deleteBlocks());
    dispatch(layoutAction.deleteLinks());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
