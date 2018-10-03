import {
  setErrorState,
  handleErrorMessage,
  handleReturnMessage,
  setDisconnected,
} from './socket.reducer';
import { pushToArchive, updateAttribute } from './attribute.reducer';
import {
  buildTestState,
  addBlock,
  addMessageInFlight,
  buildAttribute,
  buildMeta,
} from '../../testState.utilities';
import blockUtils from '../blockUtils';
import { AlarmStates } from '../../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';

jest.mock('./attribute.reducer');

const testBlockAttributes = [
  buildAttribute('foo', ['testBlock', 'foo'], 1, 0, buildMeta([], false)),
  buildAttribute('bar', ['testBlock', 'bar'], 2, 2, buildMeta([], true)),
];

const dumbBuffer = () => ({
  pop: jest.fn(),
  push: jest.fn(),
  get: jest.fn(),
  size: jest.fn(),
});

describe('socket & message reducer', () => {
  let state = {};
  let attributeIndex;
  beforeEach(() => {
    pushToArchive.mockClear();
    updateAttribute.mockClear();
    state = buildTestState().malcolm;
    addBlock('testBlock', testBlockAttributes, state);
    addMessageInFlight(1, undefined, state);
    addMessageInFlight(123, ['testBlock', 'foo'], state);
    attributeIndex = blockUtils.findAttributeIndex(
      state.blocks,
      'testBlock',
      'foo'
    );
    state.blockArchive = { testBlock: { attributes: [] } };
    state.blockArchive.testBlock.attributes[attributeIndex] = {
      timeStamp: dumbBuffer(),
      value: dumbBuffer(),
      alarmState: dumbBuffer(),
    };
  });

  it('setErrorState returns state if message with id is not found', () => {
    let updatedState = setErrorState(state, 1234567, 1);
    expect(updatedState).toBe(state);

    state.messagesInFlight[1] = { id: 1 };
    updatedState = setErrorState(state, 1234567, 1);
    expect(updatedState).toBe(state);
  });

  it('setErrorState updates the error state on the matching attribute', () => {
    const updatedState = setErrorState(state, 123, 9001);

    const attribute = updatedState.blocks.testBlock.attributes.find(
      a => a.calculated.name === 'foo'
    );
    expect(attribute.calculated.errorState).toEqual(9001);
  });

  /* TODO: this needs to be fixed in the malcolm reducer
  it('setErrorState resets layout if its PUT returns an error', () => {
    jest.mock('./attribute.reducer');
    state.messagesInFlight.push({
      id: 1,
      path: ['testBlock', 'layout'],
    });

    setErrorState(state, 1, 123);
    expect(updateAttribute).toHaveBeenCalledWith(state, { id: 1, delta: true });
  });
  */

  it('stops tracking a message once an error response is received', () => {
    const newState = handleErrorMessage(state, { id: 1 });

    expect(Object.keys(newState.messagesInFlight).length).toEqual(1);
    expect(newState.messagesInFlight[123].id).toEqual(123);
  });

  it('stops tracking a message once an return response is received', () => {
    const newState = handleReturnMessage(state, { id: 1 });

    expect(Object.keys(newState.messagesInFlight).length).toEqual(1);
    expect(newState.messagesInFlight[123].id).toEqual(123);
  });

  it('handleErrorMessage pushes method fail to archive', () => {
    state.blocks.testBlock.attributes[attributeIndex].raw.typeid =
      'malcolm:core/Method:1.0';
    const newState = handleErrorMessage(state, { id: 123 });
    expect(Object.keys(newState.messagesInFlight).length).toEqual(1);
    expect(newState.messagesInFlight[1].id).toEqual(1);
    expect(
      state.blockArchive.testBlock.attributes[attributeIndex].value.pop
    ).toHaveBeenCalledTimes(1);
    expect(
      state.blockArchive.testBlock.attributes[attributeIndex].timeStamp.pop
    ).toHaveBeenCalledTimes(1);
    expect(
      state.blockArchive.testBlock.attributes[attributeIndex].alarmState.pop
    ).toHaveBeenCalledTimes(0);

    expect(
      state.blockArchive.testBlock.attributes[attributeIndex].value.push
    ).toHaveBeenCalledTimes(1);
    expect(
      state.blockArchive.testBlock.attributes[attributeIndex].timeStamp.push
    ).toHaveBeenCalledTimes(1);
    expect(
      state.blockArchive.testBlock.attributes[attributeIndex].alarmState.push
    ).toHaveBeenCalledTimes(1);
    expect(
      state.blockArchive.testBlock.attributes[attributeIndex].alarmState.push
    ).toHaveBeenCalledWith(AlarmStates.MAJOR_ALARM);
  });

  it('does disconnect', () => {
    state = setDisconnected(state);
    expect(state.blocks.testBlock.attributes[0].raw.meta.writeable).toEqual(
      false
    );
    expect(state.blocks.testBlock.attributes[1].raw.meta.writeable).toEqual(
      false
    );
    expect(state.blocks.testBlock.attributes[0].raw.alarm.severity).toEqual(
      AlarmStates.UNDEFINED_ALARM
    );
    expect(state.blocks.testBlock.attributes[1].raw.alarm.severity).toEqual(
      AlarmStates.UNDEFINED_ALARM
    );
    expect(pushToArchive).toHaveBeenCalledTimes(1);
    expect(pushToArchive).toHaveBeenCalledWith(
      state.blockArchive.testBlock.attributes[attributeIndex],
      { raw: { timeStamp: undefined, value: 1 } },
      AlarmStates.UNDEFINED_ALARM
    );
  });
});
