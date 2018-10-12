import React from 'react';
import { DefaultLinkFactory } from 'storm-react-diagrams';
import MalcolmLinkModel from './link.model';
import MalcolmAutoLinkSegment from './autoLinkSegment';

const findHightlightClass = (model, widget, selected, hovering) => {
  if (selected || !model.targetPort) {
    return widget.bem('--highlight-path');
  }
  return hovering ? widget.bem('--hover-path') : '';
};
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

  generateLinkSegment(model, widget, selected, hovering, path) {
    return (
      <path
        className={findHightlightClass(model, widget, selected, hovering)}
        strokeWidth={model.width}
        stroke={model.color}
        strokeDasharray={
          model.sourcePort.portType === 'HIDDEN' ? '8' : undefined
        }
        d={path}
        onClick={e => {
          model.clickHandler(model.id);
          e.stopPropagation();
        }}
      />
    );
  }
}

export default MalcolmLinkFactory;
