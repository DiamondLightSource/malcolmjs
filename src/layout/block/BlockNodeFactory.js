import { AbstractNodeFactory } from 'storm-react-diagrams';
import React from 'react';
import BlockWidget from './blockWidget.component';
import BlockNodeModel from './BlockNodeModel';

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["generateReactWidget", "getNewInstance"] }] */
export default class BlockNodeFactory extends AbstractNodeFactory {
  constructor() {
    super('malcolmjsblock');
  }

  generateReactWidget(diagramEngine, node) {
    return <BlockWidget node={node} />;
  }

  getNewInstance() {
    return new BlockNodeModel();
  }
}
