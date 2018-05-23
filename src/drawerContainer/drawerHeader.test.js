import React from 'react';
import { createShallow, createMount } from 'material-ui/test-utils';
import DrawerHeader from './drawerHeader.component';

describe('DrawerHeader', () => {
  let shallow;
  let mount;

  beforeEach(() => {
    shallow = createShallow();
    mount = createMount();
  });

  afterEach(() => {
    mount.cleanUp();
  });

  it('renders correctly', () => {
    const wrapper = shallow(
      <DrawerHeader
        closeAction={() => {}}
        popOutAction={() => {}}
        title="TTLIN1"
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('closeAction calls the close method', () => {
    const closeAction = jest.fn();
    const wrapper = mount(
      <DrawerHeader
        title="TTLIN1"
        closeAction={closeAction}
        popOutAction={() => {}}
      />
    );

    wrapper
      .find('button')
      .first()
      .simulate('click');

    expect(closeAction.mock.calls.length).toEqual(1);
  });

  it('popOutAction calls the popOut method', () => {
    const popOutAction = jest.fn();
    const wrapper = mount(
      <DrawerHeader
        title="TTLIN1"
        popOutAction={popOutAction}
        closeAction={() => {}}
      />
    );

    wrapper
      .find('button')
      .last()
      .simulate('click');

    expect(popOutAction.mock.calls.length).toEqual(1);
  });
});
