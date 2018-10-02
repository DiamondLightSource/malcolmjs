import CircularBuffer from 'circular-buffer';
import { processNavigationLists } from './navigation.reducer';
import blockUtils from '../blockUtils';
import {
  ARCHIVE_REFRESH_INTERVAL,
  ARCHIVE_BUFFER_LENGTH,
} from './malcolmReducer';
import layoutReducer from './layout/layout.reducer';

export function registerNewBlock(state, action) {
  const blocks = { ...state.blocks };
  const blockArchive = { ...state.blockArchive };

  if (!Object.prototype.hasOwnProperty.call(blocks, action.payload.blockName)) {
    blocks[action.payload.blockName] = {
      typeid: 'malcolm:core/BlockMeta:1.0',
      attributes: [],
      name: action.payload.blockName,
      loading: true,
      children: [],
      orphans: [],
    };
    if (!blockArchive[action.payload.blockName]) {
      blockArchive[action.payload.blockName] = {
        attributes: [],
        name: action.payload.blockName,
      };
    }
  }

  return {
    ...state,
    blocks,
    blockArchive,
    parentBlock: action.payload.parent
      ? action.payload.blockName
      : state.parentBlock,
    childBlock: action.payload.child
      ? action.payload.blockName
      : state.childBlock,
  };
}

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
          if (attribute) {
            return attribute;
          }
          return {
            raw: {},
            calculated: {
              name: f,
              loading: true,
              children: [],
              alarms: {},
            },
          };
        });
        const payloadArchive = payload.fields.map(f => {
          const archiveAttribute = blockArchive[blockName].attributes.find(
            a => a.name === f
          );
          if (archiveAttribute) {
            return archiveAttribute;
          }
          return {
            parent: blockName,
            name: f,
            value: new CircularBuffer(ARCHIVE_BUFFER_LENGTH),
            alarmState: new CircularBuffer(ARCHIVE_BUFFER_LENGTH),
            plotValue: new CircularBuffer(ARCHIVE_BUFFER_LENGTH),
            timeStamp: new CircularBuffer(ARCHIVE_BUFFER_LENGTH),
            timeSinceConnect: new CircularBuffer(ARCHIVE_BUFFER_LENGTH),
            connectTime: -1,
            counter: 0,
            refreshRate: ARCHIVE_REFRESH_INTERVAL,
            plotTime: 0,
          };
        });
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

        blockAttributes = [...payloadAttributes, ...orphanedAttributes];
        attributeArchive = [...payloadArchive, ...orphanedArchives];
        orphans = blockAttributes
          .map(attribute => attribute.calculated.name)
          .filter(name => !payload.fields.some(child => child === name));
      } else {
        blockAttributes = blocks[blockName].attributes;
      }
      blocks[blockName] = {
        ...blocks[blockName],
        loading: false,
        label: payload.label ? payload.label : blocks[blockName].label,
        // #refactorDuplication
        attributes: blockAttributes,
        children: payload.fields
          ? [...payload.fields]
          : blocks[blockName].children,
        orphans,
      };

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
    blockArchive,
    navigation,
    layout,
  };
}

export function updateRootBlock(state, payload) {
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
