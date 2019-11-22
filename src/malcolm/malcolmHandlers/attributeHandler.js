import {
  MalcolmAttributeData,
  MalcolmMultipleAttributeData,
} from '../malcolm.types';
import LayoutHandler from './layoutHandler';
import { buildMethodUpdate } from '../actions/method.actions';
import navigationActions from '../actions/navigation.actions';
import { Widget } from '../../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';

const processDeltaMessage = (changes, oldObject) => {
  let object = { ...oldObject };
  changes.forEach(change => {
    const pathWithinObj = change[0];
    if (pathWithinObj.length !== 0) {
      let update = object;
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
      object = { ...change[1] };
    }
  });
  return object;
};

const processAttribute = (request, changedAttribute) => {
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
      delta: true,
      raw: { ...changedAttribute },
      calculated: {
        isGroup: changedAttribute.meta.tags.some(t => t === Widget.GROUP),
        inGroup,
        group,
        id: request.id,
      },
    },
  };

  return action;
};

const processAttributes = (messages, getState, dispatch) => {
  const actions = messages.map(msg =>
    processAttribute(msg.originalRequest, msg.attributeDelta)
  );
  dispatch({
    type: MalcolmMultipleAttributeData,
    payload: {
      actions,
    },
  });

  dispatch(navigationActions.subscribeToNewBlocksInRoute());

  const layoutMessages = messages.filter(msg =>
    msg.attributeDelta.meta.tags.some(t => t === Widget.FLOWGRAPH)
  );

  if (layoutMessages.length > 0) {
    layoutMessages.forEach(msg => {
      const { navigationLists } = getState().malcolm.navigation;
      const { path } = msg.originalRequest;
      const matchingNavComponentIndex = navigationLists.findIndex(
        nav => nav.blockMri === path[0]
      );

      if (
        matchingNavComponentIndex > -1 &&
        navigationLists.length > matchingNavComponentIndex + 1 &&
        navigationLists[matchingNavComponentIndex + 1].path ===
          msg.originalRequest.path[1]
      ) {
        LayoutHandler.layoutAttributeReceived(
          msg.originalRequest.path,
          getState,
          dispatch
        );
      }
    });
  }
};

const processMethod = (request, method, dispatch, isWritableFlip = false) => {
  const changedMethod = {
    typeid: method.typeid,
    raw: { ...method },
  };

  dispatch(buildMethodUpdate(request.id, changedMethod, isWritableFlip));
};

export default {
  processAttribute,
  processAttributes,
  processMethod,
  processDeltaMessage,
};
