import MalcolmPortModel from './MalcolmPortModel';
import MalcolmLinkModel from '../link/link.model';

describe('BlockPortModel', () => {
  it('createLinkModel generates a new link model', () => {
    const portModel = new MalcolmPortModel(true, 'port1', 'port 1', '123');

    const linkModel = portModel.createLinkModel();
    expect(linkModel).toBeInstanceOf(MalcolmLinkModel);
  });
});
