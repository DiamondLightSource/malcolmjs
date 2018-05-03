import {
  MalcolmNewBlock,
  MalcolmSend,
  MalcolmError,
  MalcolmBlockMeta,
} from './malcolm.types';

const initialMalcolmState = {
  messagesInFlight: [],
  blocks: {},
  parentBlock: undefined,
};

function updateMessagesInFlight(state, action) {
  const newState = state;
  newState.messagesInFlight = [
    ...state.messagesInFlight,
    { ...action.payload },
  ];
  return newState;
}

function stopTrackingMessage(state, action) {
  return {
    ...state,
    messagesInFlight: state.messagesInFlight.filter(
      m => m.id !== action.payload.id
    ),
  };
}

function registerNewBlock(state, action) {
  const blocks = { ...state.blocks };
  blocks[action.payload.blockName] = {
    name: action.payload.blockName,
    loading: true,
  };

  return {
    ...state,
    blocks,
    parentBlock: action.payload.parent
      ? action.payload.blockName
      : state.parentBlock,
  };
}

function updateBlock(state, payload) {
  const blocks = { ...state.blocks };

  if (payload.delta) {
    const blockName = state.messagesInFlight.find(m => m.id === payload.id)
      .path[0];

    if (Object.prototype.hasOwnProperty.call(blocks, blockName)) {
      blocks[blockName] = {
        ...blocks[blockName],
        loading: false,
        label: payload.label,
        fields: payload.fields.map(f => ({ name: f, loading: true })),
      };
    }
  }

  return {
    ...state,
    blocks,
  };
}

const malcolmReducer = (state = initialMalcolmState, action) => {
  switch (action.type) {
    case MalcolmNewBlock:
      return registerNewBlock(state, action);

    case MalcolmSend:
      return updateMessagesInFlight(state, action);

    case MalcolmError:
      return stopTrackingMessage(state, action);

    case MalcolmBlockMeta:
      return updateBlock(state, action.payload);

    default:
      return state;
  }
};

export default malcolmReducer;
