import React from 'react';
import { createShallow, createMount } from 'material-ui/test-utils';
import WidgetComboBox from './comboBox.component';

describe('WidgetComboBox', () => {
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
      <WidgetComboBox
        Value="2"
        Pending={false}
        Choices={['1', '2', '3']}
        selectEventHandler={() => {}}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  /*
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
  */
});
