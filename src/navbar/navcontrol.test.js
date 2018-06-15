import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import NavControl from './navcontrol.component';

describe('NavControl', () => {
  let shallow;
  let mount;

  let nav;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
    mount = createMount();

    nav = {
      path: 'PANDA:mri',
      children: ['layout', 'table'],
      childrenLabels: ['layout', 'table'],
      label: 'PANDA',
    };
  });

  afterEach(() => {
    mount.cleanUp();
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

  it('handles the nav drop down being clicked', () => {
    const wrapper = mount(<NavControl nav={nav} navigateToChild={() => {}} />);
    wrapper.find('IconButton').simulate('click');

    expect(
      wrapper
        .find(NavControl)
        .childAt(0)
        .instance().state.anchorEl
    ).toBeInstanceOf(HTMLButtonElement);
  });

  it('clicking on a menu item should close the menu and navigate to child', () => {
    const navigateFunction = jest.fn();
    const wrapper = mount(
      <NavControl nav={nav} navigateToChild={navigateFunction} />
    );

    // open the menu
    wrapper.find('IconButton').simulate('click');
    expect(
      wrapper
        .find(NavControl)
        .childAt(0)
        .instance().state.anchorEl
    ).toBeInstanceOf(HTMLButtonElement);

    wrapper
      .find('MenuItem')
      .at(0)
      .simulate('click');
    expect(
      wrapper
        .find(NavControl)
        .childAt(0)
        .instance().state.anchorEl
    ).toBeNull();
    expect(navigateFunction.mock.calls.length).toEqual(1);
  });
});
