import { MalcolmAttributeData } from '../malcolm.types';
import LayoutHandler from './layoutHandler';
import { buildMethodUpdate } from '../actions/method.actions';
import navigationActions from '../actions/navigation.actions';

const processDeltaMessage = (changes, originalRequest, getState) => {
  const pathToAttr = originalRequest.path;
  const blockName = pathToAttr[0];
  const attributeName = pathToAttr[1];
  let attribute;
  const { blocks } = getState().malcolm;
  if (blocks[blockName] && blocks[blockName].attributes) {
    const attributes = [...blocks[blockName].attributes];
    const matchingAttribute = attributes.findIndex(
      a => a.name === attributeName
    );
    if (matchingAttribute >= 0) {
      attribute = blocks[blockName].attributes[matchingAttribute];
    }
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

  const action = {
    type: MalcolmAttributeData,
    payload: {
      ...changedAttribute,
      id: request.id,
      isGroup: changedAttribute.meta.tags.some(t => t === 'widget:group'),
      inGroup,
      group,
      delta: true,
    },
  };

  dispatch(action);
  dispatch(navigationActions.subscribeToNewBlocksInRoute());

  if (changedAttribute.meta.tags.some(t => t === 'widget:flowgraph')) {
    LayoutHandler.layoutAttributeReceived(request.path, getState, dispatch);
  }
};

const processMethod = (request, changedMethod, dispatch) => {
  dispatch(buildMethodUpdate(request.id, changedMethod));
};

export default {
  processAttribute,
  processMethod,
  processDeltaMessage,
};
