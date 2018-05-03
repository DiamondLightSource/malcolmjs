import {
  MalcolmNewBlock,
  MalcolmSend,
  MalcolmError,
  MalcolmBlockMeta,
  MalcolmAttributeData,
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
        attributes: payload.fields.map(f => ({ name: f, loading: true })),
      };
    }
  }

  return {
    ...state,
    blocks,
  };
}

function updateAttribute(state, payload) {
  if (payload.delta) {
    const { path } = state.messagesInFlight.find(m => m.id === payload.id);
    const blockName = path[0];
    const attributeName = path[1];

    if (Object.prototype.hasOwnProperty.call(state.blocks, blockName)) {
      const attributes = [...state.blocks[blockName].attributes];

      const matchingAttribute = attributes.findIndex(
        a => a.name === attributeName
      );
      if (matchingAttribute >= 0) {
        attributes[matchingAttribute] = {
          ...attributes[matchingAttribute],
          loading: false,
        };
      }

      const blocks = { ...state.blocks };
      blocks[blockName] = { ...state.blocks[blockName], attributes };

      return {
        ...state,
        blocks,
      };
    }
  }

  return state;
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

    case MalcolmAttributeData:
      return updateAttribute(state, action.payload);

    default:
      return state;
  }
};

export default malcolmReducer;
