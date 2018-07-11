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
        addRow={() => {}}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('calls set flag on click', () => {
    const setFlag = jest.fn();
    const wrapper = mount(
      <WidgetTable
        attribute={harderAttribute}
        localState={{
          value: harderAttribute.raw.value,
          meta: harderAttribute.raw.meta,
          labels: Object.keys(harderAttribute.raw.meta.elements),
          flags: {
            rows: [],
            table: {
              fresh: true,
              timeStamp: harderAttribute.timeStamp,
            },
          },
        }}
        eventHandler={() => {}}
        setFlag={setFlag}
        addRow={() => {}}
      />
    );
    wrapper
      .find('input')
      .first()
      .simulate('focus');
    expect(setFlag.mock.calls.length).toEqual(1);
    expect(setFlag.mock.calls[0]).toEqual([
      ['test1', 'layout'],
      0,
      'dirty',
      { _dirty: true, dirty: { x: true } },
    ]);
  });

  it('doesnt call set flag on click if no local state defined', () => {
    const setFlag = jest.fn();
    const wrapper = mount(
      <WidgetTable
        attribute={harderAttribute}
        eventHandler={() => {}}
        setFlag={setFlag}
        addRow={() => {}}
      />
    );
    wrapper
      .find('input')
      .first()
      .simulate('focus');
    expect(setFlag.mock.calls.length).toEqual(0);
  });

  it('calls set value on checkbox click', () => {
    const setValue = jest.fn();
    const wrapper = mount(
      <WidgetTable
        attribute={harderAttribute}
        eventHandler={setValue}
        setFlag={() => {}}
        addRow={() => {}}
      />
    );
    wrapper
      .find('input')
      .last()
      .simulate('change');
    expect(setValue.mock.calls.length).toEqual(1);
    expect(setValue.mock.calls[0]).toEqual([
      ['test1', 'layout'],
      { mri: 'PANDA:INENC2', name: 'INENC2', visible: false, x: 0, y: 0 },
      3,
    ]);
  });

  it('adds row on button click', () => {
    const addRow = jest.fn();
    const wrapper = mount(
      <WidgetTable
        attribute={harderAttribute}
        eventHandler={() => {}}
        setFlag={() => {}}
        addRow={addRow}
      />
    );
    wrapper
      .find('button')
      .first()
      .simulate('click');
    expect(addRow.mock.calls.length).toEqual(1);
    expect(addRow.mock.calls[0]).toEqual([['test1', 'layout'], 4]);
  });
});
