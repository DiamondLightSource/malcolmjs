import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import { harderAttribute, expectedCopy } from './table.stories';
import { getTableWidgetTags } from './widgetSelector';
import WidgetTable, {
  getRowData,
  getTableState,
  mapRowFlagHandler,
  mapRowChangeHandler,
} from './virtualizedTable.component';

const tableRow = (row, widgetTags, props, tableState, handlers) => {
  const rowCells = getRowData(row, widgetTags, props, tableState, handlers);
  return <div>{Object.keys(rowCells).map(key => rowCells[key])}</div>;
};

const tableWidgetTags = getTableWidgetTags(harderAttribute.raw.meta);

describe('virtualized table widget', () => {
  let shallow;
  let mount;
  let props;
  let testArray;
  let testAttribute;

  beforeEach(() => {
    shallow = createShallow();
    mount = createMount();
    props = {
      localState: expectedCopy,
      attribute: harderAttribute,
      hideInfo: false,
      classes: {},
      infoClickHandler: () => {},
    };

    testArray = {
      meta: { typeid: 'foo:bar/someArrayMeta:1.6', tags: ['widget:textinput'] },
      value: ['a', 'b', 'c'],
      flags: {
        rows: [{}, {}, {}],
        table: {
          dirty: false,
          fresh: true,
          timeStamp: expectedCopy.timeStamp,
        },
      },
    };
    testAttribute = {
      calculated: {},
      raw: { meta: testArray.meta, value: ['a', 'b', 'c'] },
    };
  });

  it('table renders correctly with no selected row', () => {
    const wrapper = mount(
      <WidgetTable
        attribute={harderAttribute}
        localState={expectedCopy}
        eventHandler={() => {}}
        setFlag={() => {}}
        addRow={() => {}}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('table renders correctly for array attribute with local state', () => {
    const wrapper = mount(
      <WidgetTable
        attribute={testAttribute}
        localState={testArray}
        eventHandler={() => {}}
        setFlag={() => {}}
        addRow={() => {}}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('table renders correctly for array attribute without local state', () => {
    const wrapper = mount(
      <WidgetTable
        attribute={testAttribute}
        eventHandler={() => {}}
        setFlag={() => {}}
        addRow={() => {}}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('row renders correctly', () => {
    const wrapper = shallow(
      tableRow(0, tableWidgetTags, props, getTableState(props), {})
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('info click handler hooks up correctly', () => {
    props.infoClickHandler = jest.fn();
    const wrapper = mount(
      tableRow(0, tableWidgetTags, props, getTableState(props), {})
    );
    wrapper
      .find('button')
      .first()
      .simulate('click');
    expect(props.infoClickHandler).toHaveBeenCalledTimes(1);
    expect(props.infoClickHandler).toHaveBeenCalledWith(
      ['test1', 'layout'],
      'row.0'
    );
  });

  it('row change handler hooks up correctly', () => {
    const rowChangeHandler = jest.fn();
    const rowFlagHandler = () => {};
    const wrapper = mount(
      tableRow(0, tableWidgetTags, props, getTableState(props), {
        rowChangeHandler,
        rowFlagHandler,
      })
    );
    wrapper
      .find('input')
      .at(1)
      .simulate('change', { target: { value: 'fish' } });
    expect(rowChangeHandler).toHaveBeenCalledTimes(1);
    expect(rowChangeHandler).toHaveBeenCalledWith(
      {
        attributePath: ['test1', 'layout'],
        column: 2,
        label: 'position',
        row: 0,
      },
      'fish'
    );
  });

  it('row flag handler hooks up correctly', () => {
    const rowFlagHandler = jest.fn();
    const rowChangeHandler = () => {};
    const wrapper = mount(
      tableRow(0, tableWidgetTags, props, getTableState(props), {
        rowChangeHandler,
        rowFlagHandler,
      })
    );
    wrapper
      .find('input')
      .at(1)
      .simulate('focus');
    expect(rowFlagHandler).toHaveBeenCalledTimes(1);
    expect(rowFlagHandler).toHaveBeenCalledWith(
      {
        attributePath: ['test1', 'layout'],
        column: 2,
        label: 'position',
        row: 0,
      },
      'dirty',
      true
    );
  });

  it('mapRowChangeHandler maps as expected', () => {
    const expectedRow = expectedCopy.value[0];
    expectedRow.position = 'fish';
    const eventHandler = jest.fn();
    const testChangeHandler = mapRowChangeHandler(
      getTableState(props),
      eventHandler
    );
    testChangeHandler(
      {
        attributePath: ['test1', 'layout'],
        column: 2,
        label: 'position',
        row: 0,
      },
      'fish'
    );
    expect(eventHandler).toHaveBeenCalledTimes(1);
    expect(eventHandler).toHaveBeenCalledWith(
      ['test1', 'layout'],
      expectedRow,
      0
    );
  });

  it('mapRowFlagHandler maps as expected', () => {
    const flagHandler = jest.fn();
    const testFlagHandler = mapRowFlagHandler(expectedCopy, flagHandler);
    testFlagHandler(
      {
        attributePath: ['test1', 'layout'],
        column: 2,
        label: 'position',
        row: 0,
      },
      'dirty',
      true
    );
    expect(flagHandler).toHaveBeenCalledTimes(1);
    expect(flagHandler).toHaveBeenCalledWith(['test1', 'layout'], 0, 'dirty', {
      _dirty: true,
      dirty: { position: true },
    });
  });
});
