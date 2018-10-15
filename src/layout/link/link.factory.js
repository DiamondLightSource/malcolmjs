import React from 'react';
import { DefaultLinkFactory } from 'storm-react-diagrams';
import { emphasize, fade } from '@material-ui/core/styles/colorManipulator';
import { green } from '@material-ui/core/colors';
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

  generateLinkSegment(model, widget, selected, hovering, path) {
    let strokeColor;
    if (model.theme) {
      strokeColor = selected
        ? model.theme.palette.secondary.main
        : fade(emphasize(model.theme.palette.background.default, 0.8), 0.4);
    } else {
      // This is a link which is currently being made
      // TODO:  this color should be taken from the theme directly,
      //        but the link doesn't know about the theme until
      //        it has been created
      strokeColor = green.A400;
    }
    return (
      <path
        strokeWidth={model.width}
        stroke={strokeColor}
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
