import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import NavControl from './navcontrol.component';

describe('NavControl', () => {
  let shallow;
  let mount;

  const nav = {
    path: 'PANDA:mri',
    children: ['layout', 'table'],
    label: 'PANDA',
  };

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  afterEach(() => {
    mount = createMount();
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

  it('updates the route if the link is clicked', () => {
    const navigateFunction = jest.fn();

    const wrapper = mount(
      <NavControl nav={nav} navigateToChild={navigateFunction} />
    );

    wrapper.find('p').simulate('click');

    expect(navigateFunction.mock.calls.length).toEqual(1);
  });
});
