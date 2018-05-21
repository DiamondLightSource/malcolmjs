import React from 'react';
import { createShallow } from 'material-ui/test-utils';
import BlockPortWidget from './blockPortWidget.component';

describe('BlockPortWidget', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  const port = {
    name: 'val1',
    in: true,
    label: 'val 1',
    getParent: () => ({
      getID: () => '123456',
    }),
  };

  it('input port renders correctly', () => {
    port.in = true;

    const wrapper = shallow(<BlockPortWidget port={port} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('output port renders correctly', () => {
    port.in = false;

    const wrapper = shallow(<BlockPortWidget port={port} />);
    expect(wrapper).toMatchSnapshot();
  });
});
