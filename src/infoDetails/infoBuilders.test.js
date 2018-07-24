import { harderAttribute } from '../malcolmWidgets/table/table.stories';
import { AlarmStates } from '../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';

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
    expect(propsWithInfo).toEqual({ ...props, info: {}, value: undefined });
  });

  it('attribute info builder generates correct structure for basic attribute', () => {
    const infoObject = buildAttributeInfo(props);
    expect(infoObject.info.errorState).toBeDefined();
    expect(infoObject.info.malcolmAlarm).toBeDefined();
    expect(infoObject.info.meta).toBeDefined();
    expect(infoObject.info.timeStamp).toBeDefined();
    expect(infoObject.info.localState).not.toBeDefined();

    expect(Object.entries(infoObject.info.timeStamp)).toContainEqual(
      ...Object.entries(harderAttribute.raw.timeStamp)
    );
    expect(infoObject.info.timeStamp.inline).toBeFalsy();
    expect(Object.keys(infoObject.info.meta)).toContainEqual(
      'description',
      'label',
      'malcolmType'
    );
    expect(infoObject.info.meta.description.value).toEqual(
      harderAttribute.raw.meta.description
    );
    expect(infoObject.info.meta.malcolmType.value).toEqual(
      harderAttribute.raw.meta.typeid
    );
    expect(infoObject.info.meta.inline).toBeFalsy();
    expect(infoObject.value).toEqual(harderAttribute.raw.value);
  });

  it('attribute info builder returns correctly if state has no malcolm errors', () => {
    const infoObject = buildAttributeInfo(props);
    expect(infoObject.info.errorState.value).toEqual('n/a');
    expect(infoObject.info.errorState.alarmState).toEqual(null);
  });

  it('attribute info builder returns correctly if state has some malcolm error', () => {
    props.attribute.calculated.errorMessage = 'test Error!';
    props.attribute.calculated.errorState = true;
    const infoObject = buildAttributeInfo(props);
    expect(infoObject.info.errorState.value).toEqual('test Error!');
    expect(infoObject.info.errorState.alarmState).toEqual(
      AlarmStates.MAJOR_ALARM
    );
  });

  it('attribute info builder generates correct structure for attribute with local state when clean', () => {
    props.attribute.raw.meta.tags = ['widget:table'];
    props.attribute.calculated.dirty = false;
    const infoObject = buildAttributeInfo(props);
    expect(infoObject.info.localState).toBeDefined();
    expect(infoObject.info.localState).toEqual({
      alarmState: null,
      inline: true,
      label: 'Local State',
      tag: 'info:button',
      value: { buttonLabel: 'Discard', disabled: true },
    });
  });

  it('attribute info builder generates correct structure for attribute with local state when dirty', () => {
    props.attribute.raw.meta.tags = ['widget:table'];
    props.attribute.calculated.dirty = true;
    const infoObject = buildAttributeInfo(props);
    expect(infoObject.info.localState).toBeDefined();
    expect(infoObject.info.localState).toEqual({
      alarmState: AlarmStates.DIRTY,
      inline: true,
      label: 'Local State',
      tag: 'info:button',
      value: { buttonLabel: 'Discard', disabled: false },
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
      inline: true,
      label: 'Row local state',
      tag: 'info:button',
      value: { buttonLabel: 'Discard', disabled: true },
    });
  });

  it('addHandlers returns unmodified props if local state info isnt present', () => {
    let testInfo = {
      info: {
        otherInfo: {
          value: 'a test',
        },
      },
      otherProps: {
        blah: 'blah',
        test: { is: true },
      },
      value: 3.141,
      setFlag: 'test',
      revertHandler: 'also test',
    };
    testInfo = buildAttributeInfo(testInfo);
    expect(testInfo).toEqual({
      info: {
        otherInfo: {
          value: 'a test',
        },
      },
      otherProps: {
        blah: 'blah',
        test: { is: true },
      },
      value: 3.141,
      setFlag: 'test',
      revertHandler: 'also test',
    });
  });

  it('addHandlers adds click handler to local state info element if it exists', () => {
    let testInfo = {
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
        calculated: {},
      },
      value: 3.141,
      path: ['block1', 'test'],
      setFlag: jest.fn(),
      revertHandler: jest.fn(),
    };
    testInfo = buildAttributeInfo(testInfo);
    expect(testInfo.info.localState.functions).toBeDefined();
    testInfo.info.localState.functions.clickHandler();
    expect(testInfo.revertHandler).toHaveBeenCalledTimes(1);
    expect(testInfo.revertHandler).toHaveBeenCalledWith(['block1', 'test']);
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

  it('addHandlers adds click handler to local state info element if it exists', () => {
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
    expect(infoObject.rowRevertHandler).toHaveBeenCalledTimes(1);
    expect(infoObject.rowRevertHandler).toHaveBeenCalledWith(
      ['test1', 'layout'],
      { mri: 'PANDA:TTLIN1', name: 'TTLIN1', visible: false, x: 0, y: 0 },
      0
    );
  });
});
