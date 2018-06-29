import {
  MalcolmNewBlock,
  MalcolmSend,
  MalcolmError,
  MalcolmBlockMeta,
  MalcolmAttributeFlag,
  MalcolmNavigationPathUpdate,
  MalcolmSnackbar,
  MalcolmCleanBlocks,
  MalcolmDisconnected,
  MalcolmRootBlockMeta,
  MalcolmReturn,
  MalcolmUpdateBlockPosition,
  MalcolmSelectBlock,
  MalcolmShiftButton,
  MalcolmSocketConnect,
  MalcolmSelectPortType,
} from '../malcolm.types';
import blockUtils from '../blockUtils';
import { AlarmStates } from '../../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';
import NavigationReducer, {
  processNavigationLists,
} from './navigation.reducer';
import AttributeReducer from './attribute.reducer';
import layoutReducer from './layout.reducer';
import methodReducer from './method.reducer';
import tableReducer from './table.reducer';

const initialMalcolmState = {
  messagesInFlight: [],
  counter: 0,
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
  layoutState: {
    shiftIsPressed: false,
    selectedBlocks: [],
    layoutCenter: {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2 - 64,
    },
    startPortForLink: undefined,
    endPortForLink: undefined,
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

function setFlag(state, path, flagType, flagState) {
  if (path.length === 1) {
    const blocks = { ...state.blocks };
    const block = { ...blocks[path[0]] };
    block[flagType] = flagState;
    blocks[path[0]] = block;
    return {
      ...state,
      blocks,
    };
  }
  const blockName = path[0];
  const attributeName = path[1];

  if (Object.prototype.hasOwnProperty.call(state.blocks, blockName)) {
    if (
      !Object.prototype.hasOwnProperty.call(
        state.blocks[blockName],
        'attributes'
      )
    ) {
      return state;
    }
    const attributes = [...state.blocks[blockName].attributes];

    const matchingAttribute = attributes.findIndex(
      a => a.name === attributeName
    );
    if (matchingAttribute >= 0) {
      const attributeCopy = {
        ...attributes[matchingAttribute],
      };
      attributeCopy[flagType] = flagState;
      attributes[matchingAttribute] = attributeCopy;
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

export const setErrorState = (state, id, errorState, errorMessage) => {
  const matchingMessage = state.messagesInFlight.find(m => m.id === id);
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
        errorState,
        errorMessage,
        isDirty: errorState,
        forceUpdate: !errorState,
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

function handleReturnMessage(state, action) {
  const newState = setErrorState(state, action.payload.id, false);
  return stopTrackingMessage(newState, action);
}

const handleErrorMessage = (state, action) => {
  const matchingMessage = state.messagesInFlight.find(
    m => m.id === action.payload.id
  );

  let updatedState = { ...state };
  if (
    matchingMessage &&
    matchingMessage.path &&
    matchingMessage.path.length > 2 &&
    matchingMessage.path[matchingMessage.path.length - 2] === 'layout'
  ) {
    // reset the layout
    updatedState = AttributeReducer.updateAttribute(state, {
      id: action.payload.id,
      delta: true,
    });
  }

  return stopTrackingMessage(
    setErrorState(
      updatedState,
      action.payload.id,
      true,
      action.payload.message
    ),
    action
  );
};

const updateSocket = (state, payload) => {
  const { socketContainer } = payload;
  socketContainer.socket.url = payload.socketUrl;
  socketContainer.socket.connect(socketContainer.socket);

  return {
    ...state,
    socketContainer,
  };
};

const malcolmReducer = (state = initialMalcolmState, action) => {
  let updatedState = AttributeReducer(state, action);
  updatedState = methodReducer(updatedState, action);
  updatedState = tableReducer(updatedState, action);
  switch (action.type) {
    case MalcolmNewBlock:
      return registerNewBlock(updatedState, action);

    case MalcolmAttributeFlag:
      return setFlag(
        state,
        action.payload.path,
        action.payload.flagType,
        action.payload.flagState
      );

    case MalcolmSend:
      return updateMessagesInFlight(updatedState, action);

    case MalcolmError:
      return handleErrorMessage(updatedState, action);

    case MalcolmReturn:
      return handleReturnMessage(updatedState, action);

    case MalcolmBlockMeta:
      return updateBlock(updatedState, action.payload);

    case MalcolmRootBlockMeta:
      return updateRootBlock(updatedState, action.payload);

    case MalcolmNavigationPathUpdate:
      return NavigationReducer.updateNavigationPath(
        updatedState,
        action.payload
      );

    case MalcolmSnackbar:
      return updateSnackbar(updatedState, action.snackbar);

    case MalcolmCleanBlocks:
      return cleanBlocks(updatedState);

    case MalcolmDisconnected:
      return setDisconnected(updatedState);

    case MalcolmUpdateBlockPosition:
      layoutReducer.updateBlockPosition(
        updatedState,
        action.payload.translation
      );

      return {
        ...updatedState,
        layout: layoutReducer.processLayout(updatedState),
      };

    case MalcolmSelectBlock:
      return {
        ...updatedState,
        layoutState: layoutReducer.selectBlock(
          updatedState,
          action.payload.blockName
        ),
      };

    case MalcolmSelectPortType:
      return layoutReducer.selectPortForLink(
        updatedState,
        action.payload.portId,
        action.payload.start
      );

    case MalcolmShiftButton:
      return layoutReducer.shiftIsPressed(updatedState, action.payload);

    case MalcolmSocketConnect:
      return updateSocket(updatedState, action.payload);

    default:
      return updatedState;
  }
};

export default malcolmReducer;
