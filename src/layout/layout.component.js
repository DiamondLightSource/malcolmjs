import React from 'react';
import PropTypes from 'prop-types';
import {
  DiagramEngine,
  DiagramModel,
  DiagramWidget,
} from 'storm-react-diagrams';
import BlockNodeFactory from './block/blockWidget.factory';
import BlockNodeModel from './block/block.model';

require('storm-react-diagrams/dist/style.min.css');

const buildBlockNode = block => {
  const node = new BlockNodeModel(block.name, block.description);
  block.ports.forEach(p => node.addBlockPort(p));

  node.addIcon(block.icon);
  node.setPosition(block.position.x, block.position.y);

  return node;
};

const Layout = props => {
  const engine = new DiagramEngine();
  engine.installDefaultFactories();
  engine.registerNodeFactory(new BlockNodeFactory());

  const model = new DiagramModel();

  const nodes = props.blocks.map(b => buildBlockNode(b));
  model.addAll(...nodes);
  engine.setDiagramModel(model);

  return <DiagramWidget diagramEngine={engine} />;
};

Layout.propTypes = {
  blocks: PropTypes.arrayOf(PropTypes.shape({})),
};

Layout.defaultProps = {
  blocks: [],
};

export default Layout;
