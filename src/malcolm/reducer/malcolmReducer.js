import {
  MalcolmNewBlock,
  MalcolmSend,
  MalcolmError,
  MalcolmBlockMeta,
  MalcolmAttributeFlag,
  MalcolmNavigationPathUpdate,
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
import AttributeReducer, { updateAttribute } from './attribute.reducer';
import layoutReducer, { LayoutReduxReducer } from './layout.reducer';
import methodReducer from './method.reducer';
import tableReducer from './table.reducer';

const initialMalcolmState = {
  messagesInFlight: {},
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
  layout: {
    blocks: [],
  },
  layoutEngine: undefined,
  layoutState: {
    shiftIsPressed: false,
    selectedBlocks: [],
    layoutCenter: {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2 - 64,
    },
    startPortForLink: undefined,
    endPortForLink: undefined,
    showBin: false,
    inDeleteZone: false,
  },
};

function updateMessagesInFlight(state, action) {
  const newState = state;

  if (
    action.payload.typeid !== 'malcolm:core/Subscribe:1.0' ||
    !Object.keys(state.messagesInFlight).some(
      m =>
        state.messagesInFlight[m] !== undefined &&
        state.messagesInFlight[m].path.join() === action.payload.path.join()
    )
  ) {
    newState.messagesInFlight = {
      ...state.messagesInFlight,
    };
    newState.messagesInFlight[action.payload.id] = action.payload;
  }

  return newState;
}

function stopTrackingMessage(state, action) {
  const filteredMessages = { ...state.messagesInFlight };
  delete filteredMessages[action.payload.id];
  return {
    ...state,
    messagesInFlight: filteredMessages,
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
    const blockName = state.messagesInFlight[payload.id].path[0];

    if (Object.prototype.hasOwnProperty.call(blocks, blockName)) {
      blocks[blockName] = {
        ...blocks[blockName],
        loading: false,
        label: payload.label,
        // #refactorDuplication
        attributes: payload.fields.map(f => ({
          /*
          name: f,
          loading: true,
          children: [], */
          raw: {},
          calculated: {
            name: f,
            loading: true,
            children: [],
          },
          archive: {
            values: [],
            timeStamps: [],
            firstTime: -1,
          },
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

    const mainAttribute = blockUtils.findAttribute(
      blocks,
      blockName,
      state.mainAttribute
    );

    if (
      mainAttribute &&
      mainAttribute.meta &&
      mainAttribute.meta.tags.some(t => t === 'widget:flowgraph')
    ) {
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

  const blocks = { ...state.blocks };
  const matchingAttribute = blockUtils.findAttributeIndex(
    blocks,
    blockName,
    attributeName
  );
  if (matchingAttribute >= 0) {
    const attributes = [...state.blocks[blockName].attributes];
    const attributeCopy = {
      ...attributes[matchingAttribute],
      calculated: {
        ...attributes[matchingAttribute].calculated,
      },
    };
    // #refactorDuplication
    // if (attributeCopy.calculated) {
    attributeCopy.calculated[flagType] = flagState;
    // }
    // attributeCopy[flagType] = flagState;
    attributes[matchingAttribute] = attributeCopy;
    blocks[blockName] = { ...state.blocks[blockName], attributes };
  }
  return {
    ...state,
    blocks,
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
  // #refactorDuplication
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
              },
            };
          }
        } else {
          /*
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
          } */
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
  // #refactorDuplication
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
        ...attributes[
          matchingAttributeIndex
        ] /*
        errorState,
        errorMessage,
        dirty: errorState,
        forceUpdate: !errorState, */,
        calculated: {
          ...attributes[matchingAttributeIndex].calculated,
          errorState,
          errorMessage,
          dirty: errorState,
          forceUpdate: !errorState,
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

function handleReturnMessage(state, action) {
  const newState = setErrorState(state, action.payload.id, false);
  return stopTrackingMessage(newState, action);
}

const handleErrorMessage = (state, action) => {
  const matchingMessage = state.messagesInFlight[action.payload.id];
  let updatedState = { ...state };
  if (matchingMessage && matchingMessage.path) {
    const attribute = blockUtils.findAttribute(
      state.blocks,
      matchingMessage.path[0],
      matchingMessage.path[1]
    );
    if (
      attribute &&
      attribute.raw &&
      attribute.raw.meta.tags.some(t => t === 'widget:flowgraph')
    ) {
      // reset the layout
      const id = attribute.id === undefined ? attribute.id : action.payload.id;
      updatedState = updateAttribute(state, {
        id,
        delta: true,
      });
    }
  }

  updatedState = setErrorState(
    updatedState,
    action.payload.id,
    true,
    action.payload.message
  );
  return stopTrackingMessage(updatedState, action);
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

const malcolmReducer = (state = initialMalcolmState, action = {}) => {
  let updatedState = AttributeReducer(state, action);
  updatedState = methodReducer(updatedState, action);
  updatedState = tableReducer(updatedState, action);
  updatedState = LayoutReduxReducer(updatedState, action);

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
      updatedState = updateBlock(updatedState, action.payload);
      return NavigationReducer.updateNavTypes(updatedState);

    case MalcolmRootBlockMeta:
      updatedState = updateRootBlock(updatedState, action.payload);
      return NavigationReducer.updateNavTypes(updatedState);

    case MalcolmNavigationPathUpdate:
      updatedState = NavigationReducer.updateNavigationPath(
        updatedState,
        action.payload
      );

      updatedState = NavigationReducer.updateNavTypes(updatedState);

      return {
        ...updatedState,
        layout: layoutReducer.processLayout(updatedState),
      };

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
          action.payload.blockName,
          action.payload.isSelected
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
