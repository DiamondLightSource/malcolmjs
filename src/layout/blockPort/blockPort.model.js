import { DefaultPortModel } from 'storm-react-diagrams';
import MalcolmLinkModel from '../link/link.model';

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["createLinkModel"] }] */
class MalcolmPortModel extends DefaultPortModel {
  createLinkModel() {
    return new MalcolmLinkModel();
  }
}

export default MalcolmPortModel;
