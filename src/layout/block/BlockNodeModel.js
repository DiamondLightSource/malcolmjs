import { NodeModel } from 'storm-react-diagrams';
import MalcolmPortModel from '../blockPort/MalcolmPortModel';
import { idSeparator } from '../layout.component';

class BlockNodeModel extends NodeModel {
  constructor(block = {}) {
    super('malcolmjsblock');

    this.id = block.mri;
    this.label = block.name;
    this.description = block.description;
    this.loading = block.loading;
    this.isHiddenLink = block.isHiddenLink;
    this.hasHiddenLink = block.hasHiddenLink;
    this.addBlockPort = this.addBlockPort.bind(this);
    this.addIcon = this.addIcon.bind(this);
    this.addClickHandler = this.addClickHandler.bind(this);
    this.addMouseDownHandler = block.isHiddenLink
      ? () => {}
      : this.addMouseDownHandler.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  addBlockPort(port, portMouseDown) {
    const newPort = new MalcolmPortModel(
      port.input,
      `${this.id}${idSeparator}${port.label}`,
      port.label,
      `${this.id}${idSeparator}${port.label}`,
      port
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

  addMouseDownHandler(handler) {
    this.mouseDownHandler = show => {
      handler(show);
    };
  }
}

export default BlockNodeModel;
