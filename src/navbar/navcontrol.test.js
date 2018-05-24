import React from 'react';
import { createShallow } from 'material-ui/test-utils';
import NavControl from './navcontrol.component';

describe('NavControl', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('renders correctly', () => {
    const nav = {
      path: 'PANDA',
      children: ['layout', 'table'],
    };

    const wrapper = shallow(<NavControl nav={nav} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('disables menu item if children is empty', () => {
    const nav = {
      path: 'PANDA',
      children: [],
    };

    const wrapper = shallow(<NavControl nav={nav} />);
    expect(wrapper).toMatchSnapshot();
  });
});
