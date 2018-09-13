import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import NavControl, { NavSelector } from './navcontrol.component';

describe('NavControl', () => {
  let shallow;
  let mount;

  let nav;

  beforeEach(() => {
    shallow = createShallow();
    mount = createMount();

    nav = {
      path: 'PANDA:mri',
      children: ['layout', 'table'],
      childrenLabels: ['layout', 'table'],
      label: 'PANDA',
      parent: {
        basePath: '/',
        children: ['PANDA:mri'],
        childrenLabels: ['PANDA'],
      },
    };
  });

  afterEach(() => {
    mount.cleanUp();
  });

  it('renders correctly', () => {
    const wrapper = shallow(
      <NavControl nav={nav} navigateToChild={() => {}} />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders correctly for final', () => {
    const wrapper = shallow(
      <NavControl nav={nav} navigateToChild={() => {}} isFinalNav />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('selector component renders correctly', () => {
    const wrapper = shallow(
      <NavSelector
        handleClick={() => {}}
        childElements={nav.children}
        childElementLabels={nav.childrenLabels}
        anchorEl="⚓"
        handleClose={() => {}}
        navigateToChild={() => {}}
        icon={<div />}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('disables menu item if children is empty', () => {
    nav.parent.children = [];

    const wrapper = shallow(
      <NavSelector
        handleClick={() => {}}
        childElements={[]}
        childElementLabels={[]}
        anchorEl=""
        handleClose={() => {}}
        navigateToChild={() => {}}
        icon={<div />}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('updates the route if the link is clicked', () => {
    const navigateFunction = jest.fn();

    const wrapper = mount(
      <NavControl nav={nav} navigateToChild={navigateFunction} />
    );

    wrapper.find('Typography').simulate('click');

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
