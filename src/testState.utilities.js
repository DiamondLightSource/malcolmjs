import MockCircularBuffer from './malcolm/reducer/attribute.reducer.mocks';
import blockUtils from './malcolm/blockUtils';
import { ARCHIVE_REFRESH_INTERVAL } from './malcolm/reducer/malcolmReducer';

const buildDefaultLayoutEngine = () => ({
  diagramModel: {
    offsetX: 10,
    offsetY: 20,
    zoom: 30,
  },
});

export const buildTestState = () => ({
  // redux router information about the current url
  router: {
    location: {
      pathname: '/gui/PANDA',
    },
  },
  // all information about malcolm and the state of the server
  malcolm: {
    messagesInFlight: {},
    counter: 1,
    navigation: {
      navigationLists: [],
      rootNav: {
        path: '',
        children: [],
      },
    },
    // see addBlock for more details
    blocks: {},
    blockArchive: {},
    parentBlock: undefined,
    mainAttribute: undefined,
    childBlock: undefined,
    layout: {
      blocks: [],
    },
    layoutEngine: buildDefaultLayoutEngine(),
    layoutState: {
      selectedBlocks: [],
    },
  },
  // all the state purely about the MalcolmJS interface
  viewState: {
    footerHeight: 0,
    openChildPanel: true,
    openParentPanel: true,
    snackbar: {
      open: false,
      message: '',
    },
  },
});

export const addMessageInFlight = (id, path, malcolmState) => {
  const updatedState = malcolmState;
  updatedState.messagesInFlight[id] = {
    id,
    path,
  };
};

export const addBlockArchive = (mri, attributes, malcolmState) => {
  const updatedState = malcolmState;
  updatedState.blockArchive[mri] = {
    // see buildBlockArchiveAttribute for more details
    attributes,
  };
};

export const addBlock = (name, attributes, malcolmState, children = []) => {
  const updatedState = malcolmState;
  updatedState.blocks[name] = {
    typeid: 'malcolm:core/BlockMeta:1.0',
    name,
    loading: true,
    // see buildAttribute for more details
    attributes,
    children,
    orphans: [],
  };
};

export const buildMeta = (
  tags = [],
  writeable = true,
  label = '',
  typeid = ''
) => ({
  tags,
  writeable,
  label,
  typeid,
});

export const buildAttribute = (
  name,
  path,
  value,
  alarm = 0,
  meta = buildMeta(),
  children = [],
  loading = false
) => ({
  // the data coming back from the server is always stored in raw
  raw: {
    value,
    alarm: {
      severity: alarm,
    },
    meta,
  },
  // other additional properties are stored in calculated
  calculated: {
    name,
    loading,
    path,
    pending: false,
    children,
  },
});

export const buildBlockArchiveAttribute = (name, size) => ({
  name,
  meta: {},
  value: new MockCircularBuffer(size),
  alarmState: new MockCircularBuffer(size),
  plotValue: new MockCircularBuffer(size),
  timeStamp: new MockCircularBuffer(size),
  timeSinceConnect: new MockCircularBuffer(size),
  connectTime: -1,
  counter: 0,
  refreshRate: ARCHIVE_REFRESH_INTERVAL,
  plotTime: 0,
});

export const updatePanels = (parent, child, malcolmState) => {
  const updatedState = malcolmState;
  updatedState.parentBlock = parent;
  updatedState.childBlock = child;
};

export const addNavigationLists = (navList, malcolmState) => {
  const updatedState = malcolmState;
  updatedState.navigation.navigationLists = navList.map(n => ({ path: n }));
};

export const addSimpleLocalState = (
  malcolmState,
  blockName,
  attributeName,
  value
) => {
  const updatedState = malcolmState;
  const attributeIndex = blockUtils.findAttributeIndex(
    updatedState.blocks,
    blockName,
    attributeName
  );
  if (attributeIndex > -1) {
    updatedState.blocks[blockName].attributes[
      attributeIndex
    ].localState = value;
  }
  return updatedState;
};

export const addTableLocalState = (
  malcolmState,
  blockName,
  attributeName,
  labels,
  length
) => {
  const updatedState = malcolmState;
  const attributeIndex = blockUtils.findAttributeIndex(
    updatedState.blocks,
    blockName,
    attributeName
  );
  const attribute = blockUtils.findAttribute(
    updatedState.blocks,
    blockName,
    attributeName
  );
  const dummy = [];
  for (let i = 0; i < length; i += 1) {
    dummy[i] = '';
  }
  const dummyRow = {};
  labels.forEach(label => {
    dummyRow[label] = '';
  });
  if (attributeIndex > -1) {
    updatedState.blocks[blockName].attributes[attributeIndex].localState = {
      value: dummy.map(() => dummyRow),
      meta: JSON.parse(JSON.stringify(attribute.raw.meta)),
      labels,
      flags: {
        rows: dummy.map(() => ({})),
        table: {
          dirty: false,
          fresh: true,
          timeStamp:
            attribute.raw.timeStamp !== undefined
              ? JSON.parse(JSON.stringify(attribute.raw.timeStamp))
              : undefined,
        },
      },
    };
  }
  return updatedState;
};

export const setAttributeFlag = (
  malcolmState,
  blockName,
  attributeName,
  flagType,
  flagValue
) => {
  const updatedState = malcolmState;
  const attributeIndex = blockUtils.findAttributeIndex(
    updatedState.blocks,
    blockName,
    attributeName
  );
  if (attributeIndex > -1) {
    updatedState.blocks[blockName].attributes[attributeIndex].calculated[
      flagType
    ] = flagValue;
  }
  return updatedState;
};

export const setTableFlag = (
  malcolmState,
  blockName,
  attributeName,
  flagType,
  flagValue
) => {
  const updatedState = malcolmState;
  const attributeIndex = blockUtils.findAttributeIndex(
    updatedState.blocks,
    blockName,
    attributeName
  );
  if (attributeIndex > -1) {
    updatedState.blocks[blockName].attributes[
      attributeIndex
    ].localState.flags.table[flagType] = flagValue;
  }
  return updatedState;
};

export const buildMockDispatch = getState => {
  const actions = [];
  const dispatch = action => {
    if (typeof action === 'function') {
      action(dispatch, getState);
    } else {
      actions.push(action);
    }
  };

  return {
    actions,
    dispatch,
    getState,
    subscribe: () => {},
  };
};

export default {
  buildTestState,
  addMessageInFlight,
  addBlockArchive,
  addBlock,
  buildAttribute,
  buildMeta,
  buildBlockArchiveAttribute,
  updatePanels,
  addNavigationLists,
  buildMockDispatch,
};
