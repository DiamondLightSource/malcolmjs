import { createShallow } from '@material-ui/core/test-utils';
import { DiagramEngine, PointModel, Toolkit } from 'storm-react-diagrams';
import LinkFactory from './link.factory';
import LinkModel from './link.model';

describe('LinkFactory', () => {
  let shallow;
  const linkFactory = new LinkFactory();

  beforeEach(() => {
    shallow = createShallow();
    Toolkit.TESTING = true;
  });

  it('generates react widget', () => {
    const link = new LinkModel();
    link.points = [
      new PointModel(link, { x: 0, y: 0 }),
      new PointModel(link, { x: 10, y: 0 }),
    ];

    const engine = new DiagramEngine();
    engine.nodesRendered = true;
    engine.registerLinkFactory(linkFactory);

    const wrapper = shallow(linkFactory.generateReactWidget(engine, link));
    expect(wrapper).toMatchSnapshot();
  });

  it('generates new instance', () => {
    const model = linkFactory.getNewInstance();
    expect(model).toBeInstanceOf(LinkModel);
  });
});
