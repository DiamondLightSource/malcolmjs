import CircularBuffer from 'circular-buffer';
import createReducer from './createReducer';
import NavigationReducer, {
  processNavigationLists,
} from './navigation.reducer';
import blockUtils from '../blockUtils';
import {
  ARCHIVE_REFRESH_INTERVAL,
  ARCHIVE_BUFFER_LENGTH,
} from './malcolmReducer';
import layoutReducer from './layout/layout.reducer';
import {
  MalcolmBlockMeta,
  MalcolmCleanBlocks,
  MalcolmNewBlock,
  MalcolmRootBlockMeta,
} from '../malcolm.types';
import { Widget } from '../../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';

const processOrphans = (
  blocks,
  blockName,
  payloadAttributes,
  payloadArchive,
  blockArchive,
  payload
) => {
  const orphanedAttributes = blocks[blockName].attributes.filter(
    attribute =>
      !payloadAttributes.some(
        payloadAttribute =>
          payloadAttribute.calculated.name === attribute.calculated.name
      )
  );
  const orphanedArchives = blockArchive[blockName].attributes.filter(
    attribute =>
      !payloadArchive.some(
        payloadAttribute => payloadAttribute.name === attribute.name
      )
  );

  const blockAttributes = [...payloadAttributes, ...orphanedAttributes];
  const attributeArchive = [...payloadArchive, ...orphanedArchives];
  const orphans = blockAttributes
    .map(attribute => attribute.calculated.name)
    .filter(name => !payload.fields.some(child => child === name));
  return { blockAttributes, attributeArchive, orphans };
};

const initialiseAttribute = name => ({
  raw: {},
  calculated: {
    name,
    loading: true,
    children: {},
    alarms: {},
  },
});

const initialiseArchive = (blockName, name) => ({
  parent: blockName,
  name,
  value: new CircularBuffer(ARCHIVE_BUFFER_LENGTH),
  alarmState: new CircularBuffer(ARCHIVE_BUFFER_LENGTH),
  plotValue: new CircularBuffer(ARCHIVE_BUFFER_LENGTH),
  timeStamp: new CircularBuffer(ARCHIVE_BUFFER_LENGTH),
  timeSinceConnect: new CircularBuffer(ARCHIVE_BUFFER_LENGTH),
  connectTime: -1,
  counter: 0,
  refreshRate: ARCHIVE_REFRESH_INTERVAL,
  plotTime: 0,
});

export function updateBlock(state, payload) {
  const blocks = { ...state.blocks };
  const blockArchive = { ...state.blockArchive };
  let { navigation, layout } = state;

  if (payload.delta) {
    const blockName = state.messagesInFlight[payload.id].path[0];

    if (Object.prototype.hasOwnProperty.call(blocks, blockName)) {
      let orphans;
      let blockAttributes;
      let attributeArchive;
      if (payload.fields) {
        const payloadAttributes = payload.fields.map(f => {
          const attribute = blocks[blockName].attributes.find(
            attr => attr.calculated.name === f
          );
          return attribute || initialiseAttribute(f);
        });
        const payloadArchive = payload.fields.map(f => {
          const archiveAttribute = blockArchive[blockName].attributes.find(
            a => a.name === f
          );
          return archiveAttribute || initialiseArchive(blockName, f);
        });
        ({ blockAttributes, attributeArchive, orphans } = processOrphans(
          blocks,
          blockName,
          payloadAttributes,
          payloadArchive,
          blockArchive,
          payload
        ));
      } else {
        blockAttributes = blocks[blockName].attributes;
      }
      blocks[blockName] = {
        ...blocks[blockName],
        loading: false,
        label: payload.label ? payload.label : blocks[blockName].label,
        attributes: blockAttributes,
        orphans,
      };
      if (payload.fields) {
        payload.fields.forEach(name => {
          if (!blocks[blockName].children[name]) {
            blocks[blockName].children[name] = { label: name };
          }
        });
      }

      blockArchive[blockName] = {
        attributes: attributeArchive,
      };
    }

    if (
      state.navigation.navigationLists
        .map(nav => nav.path)
        .findIndex(path => path === blockName) > -1
    ) {
      navigation = processNavigationLists(
        state.navigation.navigationLists.map(nav => nav.path),
        blocks,
        state.navigation.viewType
      );
    }

    const mainAttribute = blockUtils.findAttribute(
      blocks,
      blockName,
      state.mainAttribute
    );

    if (
      (mainAttribute &&
        (mainAttribute.meta &&
          mainAttribute.meta.tags.some(t => t === Widget.FLOWGRAPH))) ||
      state.layout.blocks.map(block => block.mri).includes(blockName)
    ) {
      layout = layoutReducer.processLayout({ ...state, blocks });
    }
  }

  return NavigationReducer.updateNavTypes({
    ...state,
    blocks,
    blockArchive,
    navigation,
    layout,
  });
}

export function registerNewBlock(state, payload) {
  const blocks = { ...state.blocks };
  const blockArchive = { ...state.blockArchive };

  if (!Object.prototype.hasOwnProperty.call(blocks, payload.blockName)) {
    blocks[payload.blockName] = {
      typeid: 'malcolm:core/BlockMeta:1.0',
      attributes: [],
      name: payload.blockName,
      loading: true,
      children: {},
      orphans: [],
    };
    if (!blockArchive[payload.blockName]) {
      blockArchive[payload.blockName] = {
        attributes: [],
        name: payload.blockName,
      };
    }
  }

  return {
    ...state,
    blocks,
    blockArchive,
    parentBlock: payload.parent ? payload.blockName : state.parentBlock,
    childBlock: payload.child ? payload.blockName : state.childBlock,
  };
}

export function updateRootBlock(state, payload) {
  const blocks = { ...state.blocks };
  blocks['.blocks'].children = {};
  payload.blocks.mri.forEach((mri, index) => {
    blocks['.blocks'].children[mri] = {
      label: payload.blocks.label[index],
      mri,
    };
  });

  const navigation = processNavigationLists(
    state.navigation.navigationLists.map(nav => nav.path),
    blocks,
    state.navigation.viewType
  );

  return NavigationReducer.updateNavTypes({
    ...state,
    blocks,
    navigation,
  });
}

export function cleanBlocks(state) {
  const blocks = { ...state.blocks };
  Object.keys(blocks).forEach(blockName => {
    blocks[blockName] = {
      ...blocks[blockName],
      loading: true,
    };
  });
  return {
    ...state,
    blocks,
  };
}

const BlockReducer = createReducer(
  {},
  {
    [MalcolmNewBlock]: registerNewBlock,
    [MalcolmCleanBlocks]: cleanBlocks,
    [MalcolmBlockMeta]: updateBlock,
    [MalcolmRootBlockMeta]: updateRootBlock,
  }
);

export default BlockReducer;
