import { MalcolmAttributeData } from '../malcolm.types';
import LayoutHandler from './layoutHandler';

const processDeltaMessage = (changes, originalRequest, store) => {
  const pathToAttr = originalRequest.path;
  // TODO: handle attribute path properly for more general cases
  const blockName = pathToAttr[0];
  const attributeName = pathToAttr[1];
  let attribute;
  if (
    Object.prototype.hasOwnProperty.call(
      store.getState().malcolm.blocks,
      blockName
    ) &&
    Object.prototype.hasOwnProperty.call(
      store.getState().malcolm.blocks[blockName],
      'attributes'
    )
  ) {
    const attributes = [
      ...store.getState().malcolm.blocks[blockName].attributes,
    ];
    const matchingAttribute = attributes.findIndex(
      a => a.name === attributeName
    );
    if (matchingAttribute >= 0) {
      attribute = store.getState().malcolm.blocks[blockName].attributes[
        matchingAttribute
      ];
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

const processAttribute = (
  request,
  changedAttribute,
  malcolmState,
  dispatch
) => {
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
      id: request.id,
      ...changedAttribute,
      isGroup: changedAttribute.meta.tags.some(t => t === 'widget:group'),
      inGroup,
      group,
      delta: true,
    },
  };

  dispatch(action);

  if (request.path[request.path.length - 1] === 'layout') {
    LayoutHandler.layoutAttributeReceived(
      action.payload,
      malcolmState.mainAttribute,
      dispatch
    );
  }
};

export default {
  processAttribute,
  processDeltaMessage,
};
