import React from 'react';
import { DefaultLinkFactory } from 'storm-react-diagrams';
import MalcolmLinkModel from './link.model';
import MalcolmAutoLinkSegment from './autoLinkSegment';

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["generateReactWidget", "getNewInstance", "generateLinkSegment"] }] */
class MalcolmLinkFactory extends DefaultLinkFactory {
  constructor() {
    super();
    this.type = 'malcolmlink';
  }

  generateReactWidget(diagramEngine, link) {
    return React.createElement(MalcolmAutoLinkSegment, {
      link,
      diagramEngine,
    });
  }

  getNewInstance() {
    return new MalcolmLinkModel();
  }

  generateLinkSegment(model, widget, selected, path) {
    return (
      <path
        className={selected ? widget.bem('--path-selected') : ''}
        strokeWidth={model.width}
        stroke={model.color}
        d={path}
      />
    );
  }
}

export default MalcolmLinkFactory;
