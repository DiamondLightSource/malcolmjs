import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import ButtonAction from './buttonAction.component';

describe('ButtonAction', () => {
  let shallow;
  let mount;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
    mount = createMount();
  });

  afterEach(() => {
    mount.cleanUp();
  });

  it('renders correctly', () => {
    const wrapper = shallow(
      <ButtonAction text="View" clickAction={() => {}} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('calls clickAction when clicked', () => {
    const clickAction = jest.fn();
    const wrapper = mount(
      <ButtonAction text="View" clickAction={clickAction} />
    );

    wrapper.find('button').simulate('click');

    expect(clickAction.mock.calls.length).toEqual(1);
  });
});
