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
      { _dirty: true, dirty: { repeats: true } },
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

  it('calls set value on textinput change', () => {
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
      .at(2)
      .simulate('change', { target: { value: 'fish' } });
    expect(setValue.mock.calls.length).toEqual(1);
    expect(setValue.mock.calls[0]).toEqual([
      ['test1', 'layout'],
      {
        outa1: true,
        outa2: false,
        outb1: false,
        outb2: false,
        outc1: false,
        outc2: false,
        outd1: false,
        outd2: false,
        oute1: false,
        oute2: false,
        outf1: false,
        outf2: false,
        position: 'fish',
        repeats: 0,
        time1: 0,
        time2: 0,
        trigger: 'POSC>=POSITION',
      },
      0,
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
    expect(addRow.mock.calls[0]).toEqual([
      ['test1', 'layout'],
      expectedCopy.value.length,
    ]);
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
    expect(infoClick.mock.calls[0]).toEqual([['test1', 'layout'], 'row.0']);
    expect(infoClick.mock.calls[1]).toEqual([['test1', 'layout'], 'row.3']);
  });
});
