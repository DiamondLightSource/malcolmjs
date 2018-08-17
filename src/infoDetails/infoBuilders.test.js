import { harderAttribute } from '../malcolmWidgets/table/table.stories';

import { buildAttributeInfo } from './infoBuilders';

describe('info builder', () => {
  let props;
  beforeEach(() => {
    props = {
      attribute: JSON.parse(JSON.stringify(harderAttribute)),
      path: ['test1', 'layout'],
    };
  });

  it('attribute info builder returns empty object if attribute.raw not found', () => {
    props.attribute.raw = undefined;
    const propsWithInfo = buildAttributeInfo(props);
    expect(propsWithInfo).toEqual({ info: {}, value: undefined });
  });

  it('attribute info builder generates correct structure for basic attribute', () => {
    const infoObject = buildAttributeInfo(props);
    expect(infoObject.info).toEqual({
      errorState: {
        alarmStatePath: 'calculated.alarms.errorState',
        inline: true,
        label: 'Error State',
        valuePath: 'calculated.errorMessage',
      },
      malcolmAlarm: {
        label: 'Alarm',
        message: {
          inline: true,
          label: 'message',
          valuePath: 'raw.alarm.message',
        },
        severity: {
          alarmStatePath: 'calculated.alarms.rawAlarm',
          inline: true,
          label: 'severity',
          valuePath: 'raw.alarm.severity',
        },
        status: {
          inline: true,
          label: 'status',
          valuePath: 'raw.alarm.status',
        },
        typeid: {
          inline: true,
          label: 'typeid',
          valuePath: 'raw.alarm.typeid',
        },
      },
      meta: {
        description: {
          inline: true,
          label: 'Description',
          valuePath: 'raw.meta.description',
        },
        label: 'Meta Data',
        malcolmType: {
          inline: true,
          label: 'Malcolm Type',
          valuePath: 'raw.meta.typeid',
        },
        writeable: {
          inline: true,
          label: 'Writeable?',
          tag: 'widget:led',
          valuePath: 'raw.meta.writeable',
        },
      },
      path: { inline: true, label: 'Attribute path', value: 'test1, layout' },
      timeStamp: {
        label: 'Time Stamp',
        nanoseconds: {
          inline: true,
          label: 'nanoseconds',
          valuePath: 'raw.timeStamp.nanoseconds',
        },
        secondsPastEpoch: {
          inline: true,
          label: 'secondsPastEpoch',
          valuePath: 'raw.timeStamp.secondsPastEpoch',
        },
        time: {
          inline: true,
          label: 'time',
          valuePath: 'calculated.timeStamp',
        },
        typeid: {
          inline: true,
          label: 'typeid',
          valuePath: 'raw.timeStamp.typeid',
        },
        userTag: {
          inline: true,
          label: 'userTag',
          valuePath: 'raw.timeStamp.userTag',
        },
      },
    });
  });

  it('attribute info builder generates correct structure for attribute with local state', () => {
    props.attribute.raw.meta.tags = ['widget:table'];
    props.attribute.calculated.dirty = false;
    const infoObject = buildAttributeInfo(props);
    expect(infoObject.info.localState).toBeDefined();
    expect(infoObject.info.localState).toEqual({
      alarmStatePath: 'calculated.alarms.dirty',
      disabledPath: 'NOT.calculated.dirty',
      inline: true,
      label: 'Local State',
      tag: 'info:button',
      value: 'Discard',
    });
  });

  it('attribute info builder generates correct structure for attribute with sub-element defined', () => {
    const labels = Object.keys(props.attribute.raw.meta.elements);
    props.attribute.raw.meta.tags = ['widget:table'];
    props.attribute.calculated.dirty = false;
    props.attribute.localState = {
      meta: JSON.parse(JSON.stringify(props.attribute.raw.meta)),
      value: props.attribute.raw.value[labels[0]].map((value, row) => {
        const dataRow = {};
        labels.forEach(label => {
          dataRow[label] = props.attribute.raw.value[label][row];
        });
        return dataRow;
      }),
      labels,
      flags: {
        rows: props.attribute.raw.value[labels[0]].map(() => ({})),
        table: {
          dirty: false,
          fresh: true,
          timeStamp: JSON.parse(JSON.stringify(props.attribute.raw.timeStamp)),
        },
      },
    };
    props.subElement = ['row', '1'];
    const infoObject = buildAttributeInfo(props);
    expect(infoObject.info.localState).toBeDefined();
    expect(infoObject.info.localState).toEqual({
      alarmState: null,
      disabled: true,
      inline: true,
      label: 'Row local state',
      tag: 'info:button',
      value: 'Discard',
    });
  });

  it('adds click handler to local state info element if it exists', () => {
    const testProps = {
      attribute: {
        raw: {
          timeStamp: {
            secondsPastEpoch: 2 ** 31,
          },
          alarm: {},
          meta: {
            tags: ['widget:table'],
          },
        },
        calculated: {
          path: ['block1', 'test'],
        },
      },
      value: 3.141,
      setFlag: jest.fn(),
      revertHandler: jest.fn(),
    };
    const testInfo = buildAttributeInfo(testProps);
    expect(testInfo.info.localState.functions).toBeDefined();
    testInfo.info.localState.functions.clickHandler();
    expect(testProps.revertHandler).toHaveBeenCalledTimes(1);
    expect(testProps.revertHandler).toHaveBeenCalledWith(['block1', 'test']);
  });

  it('table add and delete row methods get hooked up', () => {
    const labels = Object.keys(props.attribute.raw.meta.elements);
    props.addRow = jest.fn();
    props.changeInfoHandler = jest.fn();
    props.attribute.raw.meta.tags = ['widget:table'];
    props.attribute.calculated.dirty = false;
    props.attribute.localState = {
      meta: JSON.parse(JSON.stringify(props.attribute.raw.meta)),
      value: props.attribute.raw.value[labels[0]].map((value, row) => {
        const dataRow = {};
        labels.forEach(label => {
          dataRow[label] = props.attribute.raw.value[label][row];
        });
        return dataRow;
      }),
      labels,
      flags: {
        rows: props.attribute.raw.value[labels[0]].map(() => ({})),
        table: {
          dirty: false,
          fresh: true,
          timeStamp: JSON.parse(JSON.stringify(props.attribute.raw.timeStamp)),
        },
      },
    };
    props.subElement = ['row', '1'];
    const infoObject = buildAttributeInfo(props);
    expect(infoObject.info.addRowAbove).toBeDefined();
    expect(infoObject.info.addRowBelow).toBeDefined();
    expect(infoObject.info.deleteRow).toBeDefined();
    infoObject.info.addRowBelow.functions.clickHandler();
    expect(props.addRow).toHaveBeenCalledTimes(1);
    expect(props.addRow).toHaveBeenCalledWith(['test1', 'layout'], 1, 'below');
    props.addRow.mockClear();
    infoObject.info.deleteRow.functions.clickHandler();
    expect(props.addRow).toHaveBeenCalledTimes(1);
    expect(props.addRow).toHaveBeenCalledWith(['test1', 'layout'], 1, 'delete');
    expect(props.changeInfoHandler).toHaveBeenCalledTimes(0);
    props.addRow.mockClear();
    infoObject.info.addRowAbove.functions.clickHandler();
    expect(props.addRow).toHaveBeenCalledTimes(1);
    expect(props.addRow).toHaveBeenCalledWith(['test1', 'layout'], 1);
    expect(props.changeInfoHandler).toHaveBeenCalledTimes(1);
    expect(props.changeInfoHandler).toHaveBeenCalledWith(
      ['test1', 'layout'],
      'row.2'
    );
  });

  it('table delete row methods fires info route change if bottom row selected', () => {
    const labels = Object.keys(props.attribute.raw.meta.elements);
    props.addRow = jest.fn();
    props.changeInfoHandler = jest.fn();
    props.attribute.raw.meta.tags = ['widget:table'];
    props.attribute.calculated.dirty = false;
    props.attribute.localState = {
      meta: JSON.parse(JSON.stringify(props.attribute.raw.meta)),
      value: props.attribute.raw.value[labels[0]].map((value, row) => {
        const dataRow = {};
        labels.forEach(label => {
          dataRow[label] = props.attribute.raw.value[label][row];
        });
        return dataRow;
      }),
      labels,
      flags: {
        rows: props.attribute.raw.value[labels[0]].map(() => ({})),
        table: {
          dirty: false,
          fresh: true,
          timeStamp: JSON.parse(JSON.stringify(props.attribute.raw.timeStamp)),
        },
      },
    };
    props.subElement = [
      'row',
      (props.attribute.localState.value.length - 1).toString(),
    ];
    const infoObject = buildAttributeInfo(props);

    props.addRow.mockClear();
    infoObject.info.deleteRow.functions.clickHandler();
    expect(props.addRow).toHaveBeenCalledTimes(1);
    expect(props.addRow).toHaveBeenCalledWith(['test1', 'layout'], 3, 'delete');
    expect(props.changeInfoHandler).toHaveBeenCalledTimes(1);
    expect(props.changeInfoHandler).toHaveBeenCalledWith(
      ['test1', 'layout'],
      'row.2'
    );
  });

  it('table delete row methods fires info close if only remaining row selected', () => {
    const labels = Object.keys(props.attribute.raw.meta.elements);
    const dataRow = {};
    labels.forEach(label => {
      [, dataRow[label]] = props.attribute.raw.value[label];
    });
    props.addRow = jest.fn();
    props.closeInfoHandler = jest.fn();
    props.attribute.raw.meta.tags = ['widget:table'];
    props.attribute.calculated.dirty = false;
    props.attribute.localState = {
      meta: JSON.parse(JSON.stringify(props.attribute.raw.meta)),
      value: [dataRow],
      labels,
      flags: {
        rows: props.attribute.raw.value[labels[0]].map(() => ({})),
        table: {
          dirty: false,
          fresh: true,
          timeStamp: JSON.parse(JSON.stringify(props.attribute.raw.timeStamp)),
        },
      },
    };
    props.subElement = ['row', '0'];
    const infoObject = buildAttributeInfo(props);

    props.addRow.mockClear();
    infoObject.info.deleteRow.functions.clickHandler();
    expect(props.addRow).toHaveBeenCalledTimes(1);
    expect(props.addRow).toHaveBeenCalledWith(['test1', 'layout'], 0, 'delete');
    expect(props.closeInfoHandler).toHaveBeenCalledTimes(1);
    expect(props.closeInfoHandler).toHaveBeenCalledWith(['test1', 'layout']);
  });

  it('adds click handler to local state info element if it exists', () => {
    const labels = Object.keys(props.attribute.raw.meta.elements);
    const dataRow = {};
    labels.forEach(label => {
      [, dataRow[label]] = props.attribute.raw.value[label];
    });
    props.rowRevertHandler = jest.fn();
    props.attribute.raw.meta.tags = ['widget:table'];
    props.attribute.calculated.dirty = false;
    props.attribute.localState = {
      meta: JSON.parse(JSON.stringify(props.attribute.raw.meta)),
      value: [dataRow],
      labels,
      flags: {
        rows: props.attribute.raw.value[labels[0]].map(() => ({})),
        table: {
          dirty: false,
          fresh: true,
          timeStamp: JSON.parse(JSON.stringify(props.attribute.raw.timeStamp)),
        },
      },
    };
    props.subElement = ['row', '0'];
    const infoObject = buildAttributeInfo(props);
    expect(infoObject.info.localState.functions).toBeDefined();
    infoObject.info.localState.functions.clickHandler();
    expect(props.rowRevertHandler).toHaveBeenCalledTimes(1);
    expect(props.rowRevertHandler).toHaveBeenCalledWith(
      ['test1', 'layout'],
      { mri: 'PANDA:TTLIN1', name: 'TTLIN1', visible: false, x: 0, y: 0 },
      0
    );
  });
});
