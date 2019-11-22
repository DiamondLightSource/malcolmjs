import { AlarmStates } from '../../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';
import blockUtils from '../blockUtils';
import createReducer from './createReducer';
import { pushToArchive, updateAttribute } from './attribute.reducer';
import { Widget } from '../../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';
import {
  MalcolmDisconnected,
  MalcolmError,
  MalcolmReturn,
  MalcolmSend,
  MalcolmSocketConnect,
  MalcolmClearError,
} from '../malcolm.types';

export function updateMessagesInFlight(state, payload) {
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

export function setDisconnected(state) {
  const newState = { ...state };
  newState.messagesInFlight = {};
  const blocks = { ...newState.blocks };
  Object.keys(blocks).forEach(blockName => {
    if (Object.prototype.hasOwnProperty.call(blocks[blockName], 'attributes')) {
      const attributes = [...newState.blocks[blockName].attributes];
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
                message: 'Websocket connection to server lost',
              },
            };
            const archive = newState.blockArchive[blockName];
            if (
              archive &&
              archive.attributes[attr] &&
              archive.attributes[attr].alarmState.size() !== 0 &&
              archive.attributes[attr].alarmState.get(
                archive.attributes[attr].alarmState.size() - 1
              ) !== AlarmStates.UNDEFINED_ALARM
            ) {
              const { timeStamp } = attributes[attr].raw;
              pushToArchive(
                archive.attributes[attr],
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
      blocks[blockName] = { ...newState.blocks[blockName], attributes };
    }
  });
  return {
    ...newState,
    blocks,
  };
}

export const setErrorState = (
  state,
  id,
  errorState,
  errorMessage,
  attributePath = undefined,
  suppressUpdate = false
) => {
  let path;
  if (!attributePath) {
    const matchingMessage = state.messagesInFlight[id];
    path = matchingMessage ? matchingMessage.path : undefined;
  } else {
    path = attributePath;
  }

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
          dirty: suppressUpdate ? true : errorState,
          forceUpdate: suppressUpdate ? false : !errorState,
          alarms: {
            ...attributes[matchingAttributeIndex].calculated.alarms,
            dirty: errorState ? AlarmStates.DIRTY : null,
            errorState: errorState ? AlarmStates.MAJOR_ALARM : null,
          },
          loading: false,
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

export function handleReturnMessage(state, payload) {
  const newState = setErrorState(state, payload.id, false, 'Successful');
  return stopTrackingMessage(newState, payload);
}

export function handleErrorMessage(state, payload) {
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
      attribute.raw.meta.tags.some(t => t === Widget.FLOWGRAPH)
    ) {
      // reset the layout
      const id =
        attribute.calculated.id === undefined
          ? attribute.calculated.id
          : payload.id;
      updatedState = updateAttribute(state, {
        id,
        raw: {},
        calculated: { loading: false },
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
}

export function clearErrorState(state, payload) {
  return setErrorState(state, undefined, false, undefined, payload.path, true);
}

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
    [MalcolmClearError]: clearErrorState,
  }
);

export default SocketReducer;
