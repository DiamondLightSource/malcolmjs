import { NodeModel } from 'storm-react-diagrams';
import MalcolmPortModel from '../blockPort/blockPort.model';

class BlockNodeModel extends NodeModel {
  constructor(label, description, mri) {
    super('malcolmjsblock');

    this.id = mri;
    this.label = label;
    this.description = description;
    this.addBlockPort = this.addBlockPort.bind(this);
    this.addIcon = this.addIcon.bind(this);
    this.addClickHandler = this.addClickHandler.bind(this);
  }

  addBlockPort(port, portMouseDown) {
    const newPort = new MalcolmPortModel(
      port.input,
      `${this.id}-${port.label}`,
      port.label,
      `${this.id}-${port.label}`
    );

    newPort.addMouseDownHandler(portMouseDown);
    return this.addPort(newPort);
  }

  addIcon(icon) {
    this.icon = icon;
  }

  addClickHandler(handler) {
    this.clickHandler = e => {
      handler(this);
      e.stopPropagation();
    };
  }
}

export default BlockNodeModel;
