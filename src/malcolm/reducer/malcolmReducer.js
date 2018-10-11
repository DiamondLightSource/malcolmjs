import {
  MalcolmAttributeFlag,
  MalcolmNavigationPathUpdate,
  MalcolmUpdateBlockPosition,
  MalcolmShiftButton,
  MalcolmSelectPortType,
  MalcolmIncrementMessageCount,
} from '../malcolm.types';
import blockUtils from '../blockUtils';
import { AlarmStates } from '../../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';
import NavigationReducer from './navigation.reducer';
import AttributeReducer from './attribute.reducer';
import layoutReducer, { LayoutReduxReducer } from './layout/layout.reducer';
import methodReducer from './method.reducer';
import tableReducer from './table.reducer';
import BlockReducer from './block.reducer';
import SocketReducer from './socket.reducer';

export const ARCHIVE_BUFFER_LENGTH = 1000; // length of circular buffer used for archiving
export const ARCHIVE_REFRESH_INTERVAL = 2.0; // minimum time in seconds between updates of displayed archive data

const initialMalcolmState = {
  messagesInFlight: {},
  counter: 0,
  navigation: {
    navigationLists: [],
    rootNav: {
      path: '',
      children: [],
      basePath: '/',
    },
  },
  blocks: {},
  blockArchive: {},
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
    selectedLinks: [],
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

function incrementCounter(state) {
  const updatedState = state;
  updatedState.counter += 1;
  return updatedState;
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
  let recalculateLayout = false;

  if (matchingAttribute >= 0) {
    const attributes = [...state.blocks[blockName].attributes];
    const attributeCopy = {
      ...attributes[matchingAttribute],
      calculated: {
        ...attributes[matchingAttribute].calculated,
      },
    };
    attributeCopy.calculated[flagType] = flagState;
    if (flagType === 'dirty') {
      attributeCopy.calculated.alarms = {
        ...attributeCopy.calculated.alarms,
        dirty: flagState ? AlarmStates.DIRTY : null,
      };
    } else if (flagType === 'pending' && flagState === true) {
      if (path[path.length - 1] === 'label') {
        // only a PUT on the label attribute actually affects whether
        // the layout should show the loading screen in blocks
        attributeCopy.calculated.loading = true;
        recalculateLayout = true;
      }
    }

    attributes[matchingAttribute] = attributeCopy;
    blocks[blockName] = { ...state.blocks[blockName], attributes };
  }

  const updatedState = {
    ...state,
    blocks,
  };

  // update layout here if it was a pending/true update
  if (recalculateLayout) {
    const layoutUpdates = layoutReducer.updateLayoutAndEngine(updatedState);
    updatedState.layout = layoutUpdates.layout;
    updatedState.layoutEngine = layoutUpdates.layoutEngine;
  }

  return updatedState;
}

const updateLayoutOnState = state => {
  const updatedState = state;
  const layoutUpdates = layoutReducer.updateLayoutAndEngine(updatedState);
  updatedState.layout = layoutUpdates.layout;
  updatedState.layoutEngine = layoutUpdates.layoutEngine;

  return updatedState;
};

const malcolmReducer = (state = initialMalcolmState, action = {}) => {
  let updatedState = AttributeReducer(state, action);
  updatedState = methodReducer(updatedState, action);
  updatedState = tableReducer(updatedState, action);
  updatedState = LayoutReduxReducer(updatedState, action);
  updatedState = BlockReducer(updatedState, action);
  updatedState = SocketReducer(updatedState, action);

  switch (action.type) {
    case MalcolmIncrementMessageCount:
      return incrementCounter(state);
    case MalcolmAttributeFlag:
      return setFlag(
        state,
        action.payload.path,
        action.payload.flagType,
        action.payload.flagState
      );

    case MalcolmNavigationPathUpdate:
      updatedState = NavigationReducer.updateNavigationPath(
        updatedState,
        action.payload
      );

      updatedState = NavigationReducer.updateNavTypes(updatedState);
      updatedState = updateLayoutOnState(updatedState);

      return updatedState;

    case MalcolmUpdateBlockPosition:
      layoutReducer.updateBlockPosition(
        updatedState,
        action.payload.translation
      );

      return {
        ...updatedState,
        layout: layoutReducer.processLayout(updatedState),
      };

    case MalcolmSelectPortType:
      return layoutReducer.selectPortForLink(
        updatedState,
        action.payload.portId,
        action.payload.start
      );

    case MalcolmShiftButton:
      return layoutReducer.shiftIsPressed(updatedState, action.payload);

    default:
      return updatedState;
  }
};

export default malcolmReducer;
