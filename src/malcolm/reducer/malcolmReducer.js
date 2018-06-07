import {
  MalcolmNewBlock,
  MalcolmSend,
  MalcolmError,
  MalcolmBlockMeta,
  MalcolmAttributeData,
  MalcolmAttributePending,
  MalcolmNavigationPathUpdate,
  MalcolmSnackbar,
  MalcolmCleanBlocks,
  MalcolmDisconnected,
  MalcolmRootBlockMeta,
  MalcolmMainAttributeUpdate,
  MalcolmReturn,
} from '../malcolm.types';
import { AlarmStates } from '../../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';
import NavigationReducer, {
  processNavigationLists,
} from './navigation.reducer';
import AttributeReducer from './attribute.reducer';
import layoutReducer from './layout.reducer';

const initialMalcolmState = {
  messagesInFlight: [],
  messageCounter: 0,
  navigation: {
    navigationLists: [],
    rootNav: {
      path: '',
      children: [],
    },
  },
  blocks: {},
  parentBlock: undefined,
  childBlock: undefined,
  mainAttribute: undefined,
  snackbar: {
    message: '',
    open: false,
  },
  layout: {
    blocks: [],
  },
};

function updateMessagesInFlight(state, action) {
  const newState = state;

  if (
    action.payload.typeid !== 'malcolm:core/Subscribe:1.0' ||
    !state.messagesInFlight.some(
      m => m.path.join() === action.payload.path.join()
    )
  ) {
    newState.messagesInFlight = [
      ...state.messagesInFlight,
      { ...action.payload },
    ];
  }

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

  if (!Object.prototype.hasOwnProperty.call(blocks, action.payload.blockName)) {
    blocks[action.payload.blockName] = {
      attributes: [],
      name: action.payload.blockName,
      loading: true,
      children: [],
    };
  }

  return {
    ...state,
    blocks,
    parentBlock: action.payload.parent
      ? action.payload.blockName
      : state.parentBlock,
    childBlock: action.payload.child
      ? action.payload.blockName
      : state.childBlock,
  };
}

function updateBlock(state, payload) {
  const blocks = { ...state.blocks };
  let { navigation, layout } = state;

  if (payload.delta) {
    const blockName = state.messagesInFlight.find(m => m.id === payload.id)
      .path[0];

    if (Object.prototype.hasOwnProperty.call(blocks, blockName)) {
      blocks[blockName] = {
        ...blocks[blockName],
        loading: false,
        label: payload.label,
        attributes: payload.fields.map(f => ({
          name: f,
          loading: true,
          children: [],
        })),
        children: [...payload.fields],
      };
    }

    if (
      state.navigation.navigationLists
        .map(nav => nav.path)
        .findIndex(path => path === blockName) > -1
    ) {
      navigation = processNavigationLists(
        state.navigation.navigationLists.map(nav => nav.path),
        blocks
      );
    }

    if (state.mainAttribute === 'layout') {
      layout = layoutReducer.processLayout(state);
    }
  }

  return {
    ...state,
    blocks,
    navigation,
    layout,
  };
}

function updateRootBlock(state, payload) {
  const blocks = { ...state.blocks };
  blocks['.blocks'].children = payload.blocks;

  const navigation = processNavigationLists(
    state.navigation.navigationLists.map(nav => nav.path),
    blocks
  );

  return {
    ...state,
    blocks,
    navigation,
  };
}

function setPending(state, path, pending) {
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
        pending,
      };
    }

    const blocks = { ...state.blocks };
    blocks[blockName] = { ...state.blocks[blockName], attributes };

    return {
      ...state,
      blocks,
    };
  }
  return state;
}

function updateSnackbar(state, newSnackbar) {
  return {
    ...state,
    snackbar: { ...newSnackbar },
  };
}

function cleanBlocks(state) {
  const blocks = { ...state.blocks };
  Object.keys(blocks).forEach(blockName => {
    blocks[blockName] = {
      name: blockName,
      loading: true,
      children: [],
    };
  });
  return {
    ...state,
    blocks,
  };
}

function setDisconnected(state) {
  const blocks = { ...state.blocks };
  Object.keys(blocks).forEach(blockName => {
    if (Object.prototype.hasOwnProperty.call(blocks[blockName], 'attributes')) {
      const attributes = [...state.blocks[blockName].attributes];
      for (let attr = 0; attr < attributes.length; attr += 1) {
        if (Object.prototype.hasOwnProperty.call(attributes[attr], 'meta')) {
          attributes[attr] = {
            ...attributes[attr],
            meta: {
              ...attributes[attr].meta,
              writeable: false,
            },
          };
        }
        if (Object.prototype.hasOwnProperty.call(attributes[attr], 'alarm')) {
          attributes[attr] = {
            ...attributes[attr],
            alarm: {
              ...attributes[attr].alarm,
              severity: AlarmStates.UNDEFINED_ALARM,
            },
          };
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

export const setErrorState = (state, id, errorState) => {
  const matchingMessage = state.messagesInFlight.find(m => m.id === id);
  const path = matchingMessage ? matchingMessage.path : undefined;
  if (path) {
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
          errorState,
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
};

const malcolmReducer = (state = initialMalcolmState, action) => {
  switch (action.type) {
    case MalcolmNewBlock:
      return registerNewBlock(state, action);

    case MalcolmAttributePending:
      return setPending(state, action.payload.path, action.payload.pending);

    case MalcolmSend:
      return updateMessagesInFlight(state, action);

    case MalcolmError:
      return stopTrackingMessage(
        setErrorState(state, action.payload.id, true),
        action
      );

    case MalcolmReturn:
      return stopTrackingMessage(
        setErrorState(state, action.payload.id, false),
        action
      );

    case MalcolmBlockMeta:
      return updateBlock(state, action.payload);

    case MalcolmRootBlockMeta:
      return updateRootBlock(state, action.payload);

    case MalcolmAttributeData:
      return AttributeReducer.updateAttribute(state, action.payload);

    case MalcolmMainAttributeUpdate:
      return AttributeReducer.setMainAttribute(state, action.payload);

    case MalcolmNavigationPathUpdate:
      return NavigationReducer.updateNavigationPath(state, action.payload);

    case MalcolmSnackbar:
      return updateSnackbar(state, action.snackbar);

    case MalcolmCleanBlocks:
      return cleanBlocks(state);

    case MalcolmDisconnected:
      return setDisconnected(state);

    default:
      return state;
  }
};

export default malcolmReducer;
