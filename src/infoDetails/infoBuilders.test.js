import { harderAttribute } from '../malcolmWidgets/table/table.stories';
import { AlarmStates } from '../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';

import { attributeInfo, addHandlersToInfoItems } from './infoBuilders';

describe('info builder', () => {
  const state = {
    malcolm: {
      blocks: {
        block1: {
          attributes: [],
        },
      },
    },
  };
  beforeEach(() => {
    state.malcolm.blocks.block1.attributes[0] = JSON.parse(
      JSON.stringify(harderAttribute)
    );
  });

  it('attribute info builder returns empty object if attribute not found', () => {
    const infoObject = attributeInfo(state, 'block1', 'invalidAttribute');
    expect(infoObject).toEqual({ info: {}, value: undefined });
  });

  it('attribute info builder generates correct structure for basic attribute', () => {
    const infoObject = attributeInfo(state, 'block1', 'layout');
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
    const infoObject = attributeInfo(state, 'block1', 'layout');
    expect(infoObject.info.errorState.value).toEqual('n/a');
    expect(infoObject.info.errorState.alarmState).toEqual(null);
  });

  it('attribute info builder returns correctly if state has some malcolm error', () => {
    state.malcolm.blocks.block1.attributes[0].calculated.errorMessage =
      'test Error!';
    state.malcolm.blocks.block1.attributes[0].calculated.errorState = true;
    const infoObject = attributeInfo(state, 'block1', 'layout');
    expect(infoObject.info.errorState.value).toEqual('test Error!');
    expect(infoObject.info.errorState.alarmState).toEqual(
      AlarmStates.MAJOR_ALARM
    );
  });

  it('attribute info builder generates correct structure for attribute with local state when clean', () => {
    state.malcolm.blocks.block1.attributes[0].raw.meta.tags = ['widget:table'];
    state.malcolm.blocks.block1.attributes[0].calculated.dirty = false;
    const infoObject = attributeInfo(state, 'block1', 'layout');
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
    state.malcolm.blocks.block1.attributes[0].raw.meta.tags = ['widget:table'];
    state.malcolm.blocks.block1.attributes[0].calculated.dirty = true;
    const infoObject = attributeInfo(state, 'block1', 'layout');
    expect(infoObject.info.localState).toBeDefined();
    expect(infoObject.info.localState).toEqual({
      alarmState: AlarmStates.DIRTY,
      inline: true,
      label: 'Local State',
      tag: 'info:button',
      value: { buttonLabel: 'Discard', disabled: false },
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
    testInfo = addHandlersToInfoItems(testInfo);
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
      info: {
        localState: {},
        otherInfo: {
          value: 'a test',
        },
      },
      otherProps: {
        blah: 'blah',
        test: { is: true },
      },
      value: 3.141,
      path: ['block1', 'test'],
      setFlag: jest.fn(),
      revertHandler: jest.fn(),
    };
    testInfo = addHandlersToInfoItems(testInfo);
    expect(testInfo.info.localState.functions).toBeDefined();
    testInfo.info.localState.functions.clickHandler();
    expect(testInfo.revertHandler).toHaveBeenCalledTimes(1);
    expect(testInfo.revertHandler).toHaveBeenCalledWith(['block1', 'test']);
  });
});
