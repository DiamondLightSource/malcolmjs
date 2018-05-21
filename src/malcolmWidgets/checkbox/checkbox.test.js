import React from 'react';
import { createShallow, createMount } from 'material-ui/test-utils';
import WidgetCheckbox from './checkbox.component';

describe('WidgetCheckbox', () => {
  let shallow;
  let mount;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
    mount = createMount();
  });

  afterEach(() => {
    mount.cleanUp();
  });

  it('renders unchecked', () => {
    const wrapper = shallow(
      <WidgetCheckbox
        CheckState={false}
        checkEventHandler={() => {}}
        Label="TestBox"
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('calls check', () => {
    const checkAction = jest.fn();
    const wrapper = mount(
      <WidgetCheckbox
        CheckState={false}
        checkEventHandler={() => {
          checkAction();
        }}
        Label="TestBox"
      />
    );

    wrapper.find('input').simulate('change');

    expect(checkAction.mock.calls.length).toEqual(1);
  });

  it('renders checked', () => {
    const wrapper = shallow(
      <WidgetCheckbox CheckState checkEventHandler={() => {}} Label="TestBox" />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('calls uncheck', () => {
    const uncheckAction = jest.fn();
    const wrapper = mount(
      <WidgetCheckbox
        CheckState
        checkEventHandler={() => {
          uncheckAction();
        }}
        Label="TestBox"
      />
    );

    wrapper.find('input').simulate('change');

    expect(uncheckAction.mock.calls.length).toEqual(1);
  });
});
