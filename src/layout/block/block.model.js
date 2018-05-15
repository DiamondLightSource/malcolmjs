import { NodeModel, DefaultPortModel } from 'storm-react-diagrams';

const uuidv4 = require('uuid/v4');

class BlockNodeModel extends NodeModel {
  constructor(label, description) {
    super('malcolmjsblock');

    this.label = label;
    this.description = description;
    this.addBlockPort = this.addBlockPort.bind(this);
    this.addIcon = this.addIcon.bind(this);
  }

  addBlockPort(port) {
    return this.addPort(new DefaultPortModel(port.input, uuidv4(), port.label));
  }

  addIcon(icon) {
    this.icon = icon;
  }
}

export default BlockNodeModel;
