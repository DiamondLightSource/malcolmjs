import { MalcolmAttributeData } from '../malcolm.types';
import BlockUtils from '../blockUtils';
import LayoutHandler from './layoutHandler';
import { buildMethodUpdate } from '../actions/method.actions';
import navigationActions from '../actions/navigation.actions';

const applyChangesToObject = (changes, object) => {
  let update = object;
  changes.forEach(change => {
    const pathWithinObj = change[0];
    if (pathWithinObj.length !== 0) {
      pathWithinObj.slice(0, -1).forEach(element => {
        update = Object.prototype.hasOwnProperty.call(update, element)
          ? update[element]
          : {};
      });
      if (change.length === 1) {
        delete update[pathWithinObj.slice(-1)[0]];
      } else {
        // eslint-disable-next-line prefer-destructuring
        update[pathWithinObj.slice(-1)[0]] = change[1];
      }
    } else if (change.length === 2) {
      update = { ...change[1] };
    }
  });
  return update;
};

const processDeltaMessage = (changes, originalRequest, blocks) => {
  const pathToAttr = originalRequest.path;
  const blockName = pathToAttr[0];
  const attributeName = pathToAttr[1];
  let object;
  const matchingAttribute = BlockUtils.findAttributeIndex(
    blocks,
    blockName,
    attributeName
  );
  if (matchingAttribute >= 0) {
    object = JSON.parse(
      JSON.stringify(blocks[blockName].attributes[matchingAttribute].raw)
    );
  } else if (
    BlockUtils.findBlock(blocks, blockName) &&
    attributeName === 'meta'
  ) {
    object = blocks[blockName];
  }
  return applyChangesToObject(changes, object);
};

const processAttribute = (request, changedAttribute, getState, dispatch) => {
  const inGroup = changedAttribute.meta.tags.some(
    t => t.indexOf('group:') > -1
  );
  const group = inGroup
    ? changedAttribute.meta.tags
        .find(t => t.indexOf('group:') > -1)
        .replace('group:', '')
    : '';

  // #refactorDuplication
  const action = {
    type: MalcolmAttributeData,
    payload: {
      ...changedAttribute,
      id: request.id,
      /*
        isGroup: changedAttribute.meta.tags.some(t => t === 'widget:group'),
        inGroup,
        group, */
      typeid: changedAttribute.typeid,
      delta: true,
      raw: { ...changedAttribute },
      calculated: {
        isGroup: changedAttribute.meta.tags.some(t => t === 'widget:group'),
        inGroup,
        group,
        id: request.id,
      },
    },
  };

  dispatch(action);
  dispatch(navigationActions.subscribeToNewBlocksInRoute());

  if (changedAttribute.meta.tags.some(t => t === 'widget:flowgraph')) {
    LayoutHandler.layoutAttributeReceived(request.path, getState, dispatch);
  }
};

const processMethod = (request, method, dispatch) => {
  const changedMethod = {
    typeid: method.typeid,
    raw: { ...method },
  };

  dispatch(buildMethodUpdate(request.id, changedMethod));
};

export default {
  processAttribute,
  processMethod,
  processDeltaMessage,
};
