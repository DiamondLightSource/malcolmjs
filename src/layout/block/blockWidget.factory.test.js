import { createShallow } from '@material-ui/core/test-utils';
import BlockWidgetFactory from './blockWidget.factory';
import BlockNodeModel from './block.model';

describe('BlockWidgetFactory', () => {
  let shallow;
  const blockWidgetFactory = new BlockWidgetFactory();

  beforeEach(() => {
    shallow = createShallow();
  });

  it('generates react widget', () => {
    const node = {};
    const wrapper = shallow(blockWidgetFactory.generateReactWidget(null, node));
    expect(wrapper).toMatchSnapshot();
  });

  it('generates new instance', () => {
    const model = blockWidgetFactory.getNewInstance();
    expect(model).toBeInstanceOf(BlockNodeModel);
  });
});
