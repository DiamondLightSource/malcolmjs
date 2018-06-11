import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import { Toolkit } from 'storm-react-diagrams';
import BlockWidget from './blockWidget.component';
import BlockModel from './block.model';

describe('BlockWidget', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  Toolkit.TESTING = true;

  const icon =
    '<svg height="100" width="100">' +
    '<circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />' +
    '</svg>';

  const block = new BlockModel('block 1', 'block 1 description', 'block1');
  block.addIcon(icon);
  block.addBlockPort({ label: 'in 1', input: true });
  block.addBlockPort({ label: 'out 1', input: false });
  block.addBlockPort({ label: 'out 2', input: false });

  it('block renders correctly', () => {
    const wrapper = shallow(<BlockWidget node={block} />);
    expect(wrapper).toMatchSnapshot();
  });
});
