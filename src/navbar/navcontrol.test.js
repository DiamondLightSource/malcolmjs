import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import NavControl from './navcontrol.component';

describe('NavControl', () => {
  let shallow;

  const nav = {
    path: 'PANDA',
    children: ['layout', 'table'],
  };

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('renders correctly', () => {
    const wrapper = shallow(
      <NavControl nav={nav} navigateToChild={() => {}} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('disables menu item if children is empty', () => {
    nav.children = [];

    const wrapper = shallow(
      <NavControl nav={nav} navigateToChild={() => {}} />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
