import { AlarmStates } from '../../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';
import blockUtils from '../blockUtils';
import createReducer from './createReducer';
import { pushToArchive, updateAttribute } from './attribute.reducer';
import {
  MalcolmDisconnected,
  MalcolmError,
  MalcolmReturn,
  MalcolmSend,
  MalcolmSocketConnect,
} from '../malcolm.types';

function updateMessagesInFlight(state, payload) {
  const newState = state;

  if (
    payload.typeid !== 'malcolm:core/Subscribe:1.0' ||
    !Object.keys(state.messagesInFlight).some(
      m =>
        state.messagesInFlight[m] !== undefined &&
        state.messagesInFlight[m].path.join() === payload.path.join()
    )
  ) {
    newState.messagesInFlight = {
      ...state.messagesInFlight,
    };
    newState.messagesInFlight[payload.id] = payload;
  }

  return newState;
}

function stopTrackingMessage(state, payload) {
  const filteredMessages = { ...state.messagesInFlight };
  delete filteredMessages[payload.id];
  return {
    ...state,
    messagesInFlight: filteredMessages,
  };
}

function setDisconnected(state) {
  const blocks = { ...state.blocks };
  Object.keys(blocks).forEach(blockName => {
    if (Object.prototype.hasOwnProperty.call(blocks[blockName], 'attributes')) {
      const attributes = [...state.blocks[blockName].attributes];
      for (let attr = 0; attr < attributes.length; attr += 1) {
        if (Object.prototype.hasOwnProperty.call(attributes[attr], 'raw')) {
          if (
            Object.prototype.hasOwnProperty.call(attributes[attr].raw, 'meta')
          ) {
            attributes[attr].raw = {
              ...attributes[attr].raw,
              meta: {
                ...attributes[attr].raw.meta,
                writeable: false,
              },
            };
          }
          if (
            Object.prototype.hasOwnProperty.call(attributes[attr].raw, 'alarm')
          ) {
            attributes[attr].raw = {
              ...attributes[attr].raw,
              alarm: {
                ...attributes[attr].raw.alarm,
                severity: AlarmStates.UNDEFINED_ALARM,
                message: 'Websocket connection lost',
              },
            };
            if (
              state.blockArchive[blockName] &&
              state.blockArchive[blockName].attributes[attr] &&
              state.blockArchive[blockName].attributes[attr].alarmState.get(
                state.blockArchive[blockName].attributes[
                  attr
                ].alarmState.size() - 1
              ) !== AlarmStates.UNDEFINED_ALARM
            ) {
              const { timeStamp } = attributes[attr].raw;
              pushToArchive(
                state.blockArchive[blockName].attributes[attr],
                {
                  raw: {
                    timeStamp,
                    value: attributes[attr].raw.value,
                  },
                },
                AlarmStates.UNDEFINED_ALARM
              );
            }
          }
        }
      }
      blocks[blockName] = { ...state.blocks[blockName], attributes };
    }
  });
  return {
    ...state,
    blocks,
    counter: 0,
  };
}

export const setErrorState = (state, id, errorState, errorMessage) => {
  const matchingMessage = state.messagesInFlight[id];
  const path = matchingMessage ? matchingMessage.path : undefined;
  if (path) {
    const blockName = path[0];
    const attributeName = path[1];

    const matchingAttributeIndex = blockUtils.findAttributeIndex(
      state.blocks,
      blockName,
      attributeName
    );
    const blocks = { ...state.blocks };
    if (matchingAttributeIndex >= 0) {
      const { attributes } = state.blocks[blockName];
      attributes[matchingAttributeIndex] = {
        ...attributes[matchingAttributeIndex],
        calculated: {
          ...attributes[matchingAttributeIndex].calculated,
          errorState,
          errorMessage,
          dirty: errorState,
          forceUpdate: !errorState,
          alarms: {
            ...attributes[matchingAttributeIndex].calculated.alarms,
            dirty: errorState ? AlarmStates.DIRTY : null,
            errorState: errorState ? AlarmStates.MAJOR_ALARM : null,
          },
        },
      };
      blocks[blockName] = { ...state.blocks[blockName], attributes };
    }
    return {
      ...state,
      blocks,
    };
  }
  return state;
};

function handleReturnMessage(state, payload) {
  const newState = setErrorState(state, payload.id, false, 'Successful');
  return stopTrackingMessage(newState, payload);
}

const handleErrorMessage = (state, payload) => {
  const matchingMessage = state.messagesInFlight[payload.id];
  let updatedState = { ...state };
  if (matchingMessage && matchingMessage.path) {
    const blockName = matchingMessage.path[0];
    const matchingAttributeIndex = blockUtils.findAttributeIndex(
      state.blocks,
      blockName,
      matchingMessage.path[1]
    );
    const attribute =
      matchingAttributeIndex > -1
        ? state.blocks[blockName].attributes[matchingAttributeIndex]
        : undefined;
    if (
      attribute &&
      attribute.raw &&
      attribute.raw.meta &&
      attribute.raw.meta.tags &&
      attribute.raw.meta.tags.some(t => t === 'widget:flowgraph')
    ) {
      // reset the layout
      const id = attribute.id === undefined ? attribute.id : payload.id;
      updatedState = updateAttribute(state, {
        id,
        delta: true,
      });
    } else if (
      attribute &&
      attribute.raw.typeid === 'malcolm:core/Method:1.0'
    ) {
      const attributes = [...state.blockArchive[blockName].attributes];
      const archive = { ...attributes[matchingAttributeIndex] };
      const runParams = archive.value.pop();
      const localRunTime = archive.timeStamp.pop();
      archive.value.push({
        ...runParams,
        returned: { error: payload.message },
        returnStatus: `Failed: ${payload.message}`,
      });
      archive.timeStamp.push({ ...localRunTime, localReturnTime: new Date() });
      archive.alarmState.push(AlarmStates.MAJOR_ALARM);
      attributes[matchingAttributeIndex] = archive;
      updatedState.blockArchive[blockName] = {
        ...state.blockArchive[blockName],
        attributes,
      };
    }
  }

  updatedState = setErrorState(updatedState, payload.id, true, payload.message);
  return stopTrackingMessage(updatedState, payload);
};

const updateSocket = (state, payload) => {
  const { worker } = payload;
  worker.postMessage(`connect::${payload.socketUrl}`);

  return {
    ...state,
  };
};

const SocketReducer = createReducer(
  {},
  {
    [MalcolmSend]: updateMessagesInFlight,
    [MalcolmError]: handleErrorMessage,
    [MalcolmReturn]: handleReturnMessage,
    [MalcolmSocketConnect]: updateSocket,
    [MalcolmDisconnected]: setDisconnected,
  }
);

export default SocketReducer;
