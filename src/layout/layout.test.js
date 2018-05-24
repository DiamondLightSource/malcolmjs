import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import { Toolkit } from 'storm-react-diagrams';
import Layout from './layout.component';

describe('Layout', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  Toolkit.TESTING = true;

  const icon =
    '<svg height="100" width="100">' +
    '<circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />' +
    '</svg>';

  const block = {
    name: 'block 1',
    description: 'block 1 description',
    icon,
    ports: [
      { label: 'in 1', input: true },
      { label: 'out 1', input: false },
      { label: 'out 2', input: false },
    ],
    position: {
      x: 100,
      y: 200,
    },
  };

  it('renders correctly', () => {
    const wrapper = shallow(<Layout blocks={[block]} />);
    expect(wrapper).toMatchSnapshot();
  });
});
