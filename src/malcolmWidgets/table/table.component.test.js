import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';

import WidgetTable from './table.component';
import { harderAttribute, expectedCopy } from './table.stories';

describe('WidgetTable', () => {
  let shallow;
  let mount;
  let localState;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
    mount = createMount();
    localState = expectedCopy;
  });

  it('renders correctly with no selected row', () => {
    const wrapper = shallow(
      <WidgetTable
        attribute={harderAttribute}
        localState={localState}
        eventHandler={() => {}}
        setFlag={() => {}}
        addRow={() => {}}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly with selected row', () => {
    localState.flags.table.selectedRow = 1;
    const wrapper = shallow(
      <WidgetTable
        attribute={harderAttribute}
        localState={localState}
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
          value: harderAttribute.raw.value[
            Object.keys(harderAttribute.raw.meta.elements)[0]
          ].map((val, row) => {
            const rowData = {};
            Object.keys(harderAttribute.raw.meta.elements).forEach(label => {
              rowData[label] = harderAttribute.raw.value[label][row];
            });
            return rowData;
          }),
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
      .last()
      .simulate('click');
    expect(addRow.mock.calls.length).toEqual(1);
    expect(addRow.mock.calls[0]).toEqual([['test1', 'layout'], 4]);
  });

  it('selects row and opens info on click', () => {
    const setFlag = jest.fn();
    const infoClick = jest.fn();
    const rowClick = jest.fn();
    const wrapper = mount(
      <WidgetTable
        attribute={harderAttribute}
        eventHandler={() => {}}
        setFlag={setFlag}
        addRow={() => {}}
        infoClickHandler={infoClick}
        rowClickHandler={rowClick}
      />
    );
    const buttons = wrapper.find('button');
    buttons.at(0).simulate('click');
    buttons.at(3).simulate('click');
    expect(infoClick.mock.calls.length).toEqual(2);
    expect(rowClick.mock.calls.length).toEqual(2);
    expect(infoClick.mock.calls[0]).toEqual([['test1', 'layout'], 'row.0']);
    expect(infoClick.mock.calls[1]).toEqual([['test1', 'layout'], 'row.3']);
    expect(rowClick.mock.calls[0]).toEqual([['test1', 'layout'], 'row.0']);
    expect(rowClick.mock.calls[1]).toEqual([['test1', 'layout'], 'row.3']);
  });
});
