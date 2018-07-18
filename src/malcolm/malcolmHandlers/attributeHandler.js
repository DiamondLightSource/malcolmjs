import { MalcolmAttributeData } from '../malcolm.types';
import BlockUtils from '../blockUtils';
import LayoutHandler from './layoutHandler';
import { buildMethodUpdate } from '../actions/method.actions';
import navigationActions from '../actions/navigation.actions';

const processDeltaMessage = (changes, originalRequest, getState) => {
  const pathToAttr = originalRequest.path;
  const blockName = pathToAttr[0];
  const attributeName = pathToAttr[1];
  let attribute;
  const { blocks } = getState().malcolm;
  const matchingAttribute = BlockUtils.findAttributeIndex(
    blocks,
    blockName,
    attributeName
  );
  if (matchingAttribute >= 0) {
    attribute = JSON.parse(
      JSON.stringify(blocks[blockName].attributes[matchingAttribute].raw)
    );
  }
  changes.forEach(change => {
    const pathWithinAttr = change[0];
    if (pathWithinAttr.length !== 0) {
      let update = attribute;
      pathWithinAttr.slice(0, -1).forEach(element => {
        update = Object.prototype.hasOwnProperty.call(update, element)
          ? update[element]
          : {};
      });
      if (change.length === 1) {
        delete update[pathWithinAttr.slice(-1)[0]];
      } else {
        // eslint-disable-next-line prefer-destructuring
        update[pathWithinAttr.slice(-1)[0]] = change[1];
      }
    } else if (change.length === 2) {
      attribute = { ...change[1] };
    }
  });
  return attribute;
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
