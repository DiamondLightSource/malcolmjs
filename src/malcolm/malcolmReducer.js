import { MalcolmNewBlock } from './malcolm.types';

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

const malcolmReducer = (state = initialMalcolmState, action) => {
  switch (action.type) {
    case MalcolmNewBlock:
      return registerNewBlock(state, action);

    case 'malcolm:send':
      return updateMessagesInFlight(state, action);

    case 'malcolm:error':
      return stopTrackingMessage(state, action);

    default:
      return state;
  }
};

export default malcolmReducer;
