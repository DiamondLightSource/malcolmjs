import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';

import WidgetTable from './table.component';
import { harderAttribute } from './table.stories';

describe('WidgetTable', () => {
  let shallow;
  let mount;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
    mount = createMount();
  });

  it('renders correctly', () => {
    const wrapper = shallow(
      <WidgetTable
        attribute={harderAttribute}
        eventHandler={() => {}}
        setFlag={() => {}}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('calls set flag on click', () => {
    const setFlag = jest.fn();
    const wrapper = mount(
      <WidgetTable
        attribute={harderAttribute}
        eventHandler={() => {}}
        setFlag={setFlag}
      />
    );
    wrapper
      .find('input')
      .first()
      .simulate('focus');
    expect(setFlag.mock.calls.length).toEqual(1);
    expect(setFlag.mock.calls[0]).toEqual([
      { column: 2, label: 'x', row: 0 },
      'dirty',
      true,
    ]);
  });

  it('calls set value on checkbox click', () => {
    const setValue = jest.fn();
    const wrapper = mount(
      <WidgetTable
        attribute={harderAttribute}
        eventHandler={setValue}
        setFlag={() => {}}
      />
    );
    wrapper
      .find('input')
      .last()
      .simulate('change');
    expect(setValue.mock.calls.length).toEqual(1);
    expect(setValue.mock.calls[0]).toEqual([
      ['PANDA', 'layout'],
      { mri: 'PANDA:INENC2', name: 'INENC2', visible: false, x: 0, y: 0 },
    ]);
  });
});
