import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  DiagramEngine,
  DiagramModel,
  DiagramWidget,
} from 'storm-react-diagrams';
import BlockNodeFactory from './block/blockWidget.factory';
import BlockNodeModel from './block/block.model';
import MalcolmLinkFactory from './link/link.factory';
import { updateChildPanel } from '../viewState/viewState.actions';
import {
  malcolmSelectBlock,
  malcolmLayoutUpdatePosition,
  malcolmLayoutShiftIsPressed,
} from '../malcolm/malcolmActionCreators';

require('storm-react-diagrams/dist/style.min.css');

const buildBlockNode = (block, selectedBlocks, clickHandler) => {
  const node = new BlockNodeModel(block.name, block.description, block.mri);
  block.ports.forEach(p => node.addBlockPort(p));
  node.addIcon(block.icon);
  node.setPosition(block.position.x, block.position.y);
  node.addClickHandler(clickHandler);
  node.selected = selectedBlocks.some(b => b === block.mri);

  return node;
};

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
    const { props } = this;

    const engine = new DiagramEngine();
    engine.installDefaultFactories();
    engine.registerNodeFactory(new BlockNodeFactory());
    engine.registerLinkFactory(new MalcolmLinkFactory());

    const model = new DiagramModel();

    const nodes = props.blocks.map(b =>
      buildBlockNode(b, props.selectedBlocks, node =>
        props.clickHandler(props.url, b, node, props.selectedBlocks)
      )
    );

    const links = [];
    props.blocks.forEach(b => {
      const linkStarts = b.ports.filter(p => p.input && p.tag !== p.value);

      const startNode = nodes.find(n => n.id === b.mri);
      linkStarts.forEach(start => {
        const startPort = startNode.ports[`${b.mri}-${start.label}`];

        if (startPort !== undefined) {
          // need to find the target port and link them together
          const targetPortValue = start.value;
          const endBlock = props.blocks.find(block =>
            block.ports.some(p => !p.input && p.tag === targetPortValue)
          );

          if (endBlock) {
            const end = endBlock.ports.find(
              p => !p.input && p.tag === targetPortValue
            );

            const endNode = nodes.find(n => n.id === endBlock.mri);
            const endPort = endNode.ports[`${endBlock.mri}-${end.label}`];
            links.push(endPort.link(startPort));
          }
        }
      });
    });

    model.addAll(...nodes, ...links);
    engine.setDiagramModel(model);

    return <DiagramWidget diagramEngine={engine} maxNumberPointsPerLink={0} />;
  }
}

Layout.propTypes = {
  shiftPressed: PropTypes.bool.isRequired,
  shiftKeyHandler: PropTypes.func.isRequired,
};

Layout.defaultProps = {};

const mapStateToProps = state => ({
  blocks: state.malcolm.layout.blocks,
  url: state.router.location.pathname,
  shiftPressed: state.malcolm.layoutState.shiftIsPressed,
  selectedBlocks: state.malcolm.layoutState.selectedBlocks,
});

const mapDispatchToProps = dispatch => ({
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
        .slice(-1) !== block.mri
    ) {
      dispatch(updateChildPanel(url, block.mri));
    }
  },
  shiftKeyHandler: shiftIsDown =>
    dispatch(malcolmLayoutShiftIsPressed(shiftIsDown)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
