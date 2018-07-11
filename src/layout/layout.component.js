import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DiagramWidget } from 'storm-react-diagrams';
import navigationActions from '../malcolm/actions/navigation.actions';
import {
  malcolmSelectBlock,
  malcolmLayoutUpdatePosition,
  malcolmLayoutShiftIsPressed,
} from '../malcolm/malcolmActionCreators';
import { buildDiagramEngine } from './layout.builder';
import { selectPort } from '../malcolm/actions/layout.action';

require('storm-react-diagrams/dist/style.min.css');

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyPress);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  handleKeyPress(event) {
    if (event.key === 'Shift' && !this.props.shiftPressed) {
      this.props.shiftKeyHandler(true);
    }
  }

  handleKeyUp(event) {
    if (event.key === 'Shift' && this.props.shiftPressed) {
      this.props.shiftKeyHandler(false);
    }
  }

  render() {
    const {
      blocks,
      selectedBlocks,
      url,
      clickHandler,
      portMouseDown,
    } = this.props;
    const engine = buildDiagramEngine(
      blocks,
      selectedBlocks,
      url,
      clickHandler,
      portMouseDown
    );
    return <DiagramWidget diagramEngine={engine} maxNumberPointsPerLink={0} />;
  }
}

Layout.propTypes = {
  blocks: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectedBlocks: PropTypes.arrayOf(PropTypes.string).isRequired,
  url: PropTypes.string.isRequired,
  clickHandler: PropTypes.func.isRequired,
  shiftPressed: PropTypes.bool.isRequired,
  shiftKeyHandler: PropTypes.func.isRequired,
  portMouseDown: PropTypes.func.isRequired,
};

Layout.defaultProps = {};

export const mapStateToProps = state => ({
  blocks: state.malcolm.layout.blocks,
  url: state.router.location.pathname,
  shiftPressed: state.malcolm.layoutState.shiftIsPressed,
  selectedBlocks: state.malcolm.layoutState.selectedBlocks,
});

export const mapDispatchToProps = dispatch => ({
  clickHandler: (url, block, node, selectedBlocks) => {
    const translation = {
      x: node.x - block.position.x,
      y: node.y - block.position.y,
    };

    if (!selectedBlocks.some(b => b === block.mri)) {
      dispatch(malcolmSelectBlock(block.mri));
    }

    if (
      Math.abs(node.x - block.position.x) > 3 ||
      Math.abs(node.y - block.position.y) > 3
    ) {
      dispatch(malcolmLayoutUpdatePosition(translation));
    }

    if (
      url
        .replace(/\/$/, '')
        .split('/')
        .slice(-1)[0] !== block.name
    ) {
      dispatch(navigationActions.updateChildPanel(block.name));
    }
  },
  shiftKeyHandler: shiftIsDown =>
    dispatch(malcolmLayoutShiftIsPressed(shiftIsDown)),
  portMouseDown: (portId, start) => {
    dispatch(selectPort(portId, start));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
