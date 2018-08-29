import { DefaultPortModel } from 'storm-react-diagrams';
import MalcolmLinkModel from '../link/link.model';

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["createLinkModel"] }] */
class MalcolmPortModel extends DefaultPortModel {
  constructor(isInput, name, label, id, port) {
    super(isInput, name, label, id);
    if (port) {
      this.portType = port.portType;
      this.hiddenLink = port.hiddenLink;
      this.value = port.value;
    }
    this.addMouseDownHandler = this.addMouseDownHandler.bind(this);
  }

  createLinkModel() {
    return new MalcolmLinkModel();
  }

  addMouseDownHandler(handler) {
    this.mouseDownHandler = (e, startPort) => {
      handler(this.id, startPort);
    };
  }
}

export default MalcolmPortModel;
