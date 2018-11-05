import {
  MalcolmSend,
  MalcolmNewBlock,
  MalcolmAttributeFlag,
  MalcolmNavigationPathUpdate,
  MalcolmCleanBlocks,
  MalcolmDisconnected,
  MalcolmMainAttributeUpdate,
  MalcolmReturn,
  MalcolmError,
  MalcolmUpdateBlockPosition,
  MalcolmSelectBlock,
  MalcolmShiftButton,
  MalcolmLocalCopy,
  MalcolmTableUpdate,
  MalcolmTableFlag,
  MalcolmRevert,
  MalcolmSelectLinkType,
  MalcolmSimpleLocalState,
  MalcolmClearError,
} from './malcolm.types';
import blockUtils from './blockUtils';
import {
  malcolmArchivePost,
  malcolmFlagMethodInput,
} from './actions/method.actions';
import { rootBlockSubPath } from './malcolmHandlers/blockMetaHandler';

export const malcolmSubscribeAction = (path, delta = true) => ({
  type: MalcolmSend,
  payload: {
    typeid: 'malcolm:core/Subscribe:1.0',
    path,
    delta,
  },
});

export const malcolmNewBlockAction = (blockName, parent, child) => ({
  type: MalcolmNewBlock,
  payload: {
    blockName,
    parent,
    child,
  },
});

export const malcolmGetAction = path => (dispatch, getState) => {
  if (!getState().malcolm.blocks[path[0]]) {
    dispatch(malcolmNewBlockAction(path[0], false, false));
  }
  dispatch({
    type: MalcolmSend,
    payload: {
      typeid: 'malcolm:core/Get:1.0',
      path,
    },
  });
};
/*
export const malcolmGetLinkSource = () => (dispatch, getState) => {
  const state = getState().malcolm;
  const layout = {};
  layout.visible.forEach(
    (b, index) => !b && dispatch(malcolmGetAction([layout.mri[index], 'meta']))
  );
  // Wait until all Block Gets and Gets they kicked off have returned (but don't block)...
  const sourceIndex = layout.visible.findIndex(
    (b, index) => !b && blockUtils.findAttributesWithTag(state.blocks[layout.mri[index]], port.value).length > 0
  );
};
*/
export const malcolmPutAction = (path, value) => ({
  type: MalcolmSend,
  payload: {
    typeid: 'malcolm:core/Put:1.0',
    path,
    value,
  },
});

export const malcolmSetFlag = (path, flagType, flagState) => ({
  type: MalcolmAttributeFlag,
  payload: {
    path,
    flagType,
    flagState,
  },
});

export const malcolmPostAction = (path, rawParameters) => (
  dispatch,
  getState
) => {
  const state = getState().malcolm;
  const method = blockUtils.findAttribute(state.blocks, path[0], path[1]);
  const parameters = {};
  Object.keys(rawParameters).forEach(param => {
    parameters[param] = rawParameters[param].value;
  });
  let missing = [];
  if (method && method.calculated.isMethod) {
    missing = method.raw.takes.required.filter(
      param => !Object.keys(rawParameters).includes(param)
    );
  }
  if (missing.length === 0) {
    dispatch(malcolmSetFlag(path, 'pending', true));
    dispatch(malcolmArchivePost(path, rawParameters));
    dispatch({
      type: MalcolmSend,
      payload: {
        typeid: 'malcolm:core/Post:1.0',
        path,
        parameters,
      },
    });
  } else {
    missing.forEach(param => {
      dispatch(
        malcolmFlagMethodInput(
          path,
          param,
          'invalid',
          `Warning: parameter ${param} is required to run method ${path[1]}`
        )
      );
    });
  }
};

export const malcolmNavigationPath = blockPaths => ({
  type: MalcolmNavigationPathUpdate,
  payload: {
    blockPaths,
  },
});

export const malcolmResetBlocks = () => (dispatch, getState) => {
  dispatch({
    type: MalcolmCleanBlocks,
  });

  const state = getState();
  state.malcolm.messagesInFlight = {};
  dispatch(malcolmSubscribeAction(rootBlockSubPath, false));
  Object.values(state.malcolm.blocks)
    .filter(block => block.name !== '.blocks')
    .forEach(block => {
      dispatch(malcolmSubscribeAction([block.name, 'meta']));
    });
};

export const malcolmSetDisconnected = () => ({
  type: MalcolmDisconnected,
});

export const malcolmMainAttribute = attribute => ({
  type: MalcolmMainAttributeUpdate,
  payload: {
    attribute,
  },
});

export const malcolmCopyValue = path => ({
  type: MalcolmLocalCopy,
  payload: {
    path,
  },
});

export const malcolmSetTableFlag = (path, row, flagType, flags) => ({
  type: MalcolmTableFlag,
  payload: {
    path,
    row,
    flagType,
    flags,
  },
});

export const malcolmUpdateTable = (path, value, row) => ({
  type: MalcolmTableUpdate,
  payload: {
    path,
    value,
    row,
  },
});

export const malcolmLayoutUpdatePosition = translation => (
  dispatch,
  getState
) => {
  dispatch({
    type: MalcolmUpdateBlockPosition,
    payload: {
      translation,
    },
  });

  const state = getState().malcolm;
  const blockName = state.parentBlock;
  const layoutAttribute = blockUtils.findAttribute(
    state.blocks,
    blockName,
    'layout'
  );

  const { selectedBlocks } = state.layoutState;
  if (layoutAttribute) {
    const updateLayoutIndices = selectedBlocks
      .map(b => layoutAttribute.raw.value.mri.findIndex(val => val === b))
      .filter(i => i > -1); // ensure no nulls
    const updateLayout = {
      name: updateLayoutIndices.map(i => layoutAttribute.raw.value.name[i]),
      visible: updateLayoutIndices.map(
        i => layoutAttribute.raw.value.visible[i]
      ),
      mri: updateLayoutIndices.map(i => layoutAttribute.raw.value.mri[i]),
      x: updateLayoutIndices.map(
        i => layoutAttribute.raw.value.x[i] + translation.x
      ),
      y: updateLayoutIndices.map(
        i => layoutAttribute.raw.value.y[i] + translation.y
      ),
    };

    dispatch(malcolmSetFlag([blockName, 'layout'], 'pending', true));
    dispatch(malcolmPutAction([blockName, 'layout', 'value'], updateLayout));
  }
};

export const malcolmSelectBlock = (blockName, isSelected) => ({
  type: MalcolmSelectBlock,
  payload: {
    blockName,
    isSelected,
  },
});

export const malcolmSelectLink = (linkName, isSelected) => ({
  type: MalcolmSelectLinkType,
  payload: {
    linkName,
    isSelected,
  },
});

export const malcolmLayoutShiftIsPressed = shiftIsPressed => ({
  type: MalcolmShiftButton,
  payload: {
    shiftIsPressed,
  },
});

export const malcolmHailReturn = (payload, isErrorState) => ({
  type: isErrorState ? MalcolmError : MalcolmReturn,
  payload,
});

export const malcolmRevertAction = path => dispatch => {
  dispatch(malcolmSetFlag(path, 'dirty', false));
  dispatch({
    type: MalcolmRevert,
    payload: { path },
  });
};

export const writeLocalState = (path, value) => ({
  type: MalcolmSimpleLocalState,
  payload: {
    path,
    value,
  },
});

export const clearError = path => ({
  type: MalcolmClearError,
  payload: {
    path,
  },
});

export const malcolmClearLayoutSelect = () => (dispatch, getState) => {
  getState().malcolm.layoutState.selectedLinks.forEach(link =>
    dispatch(malcolmSelectLink(link, false))
  );
  getState().malcolm.layoutState.selectedBlocks.forEach(block =>
    dispatch(malcolmSelectBlock(block, false))
  );
};

export default {
  malcolmHailReturn,
  malcolmGetAction,
  malcolmSubscribeAction,
  malcolmNewBlockAction,
  malcolmPutAction,
  malcolmSetFlag,
  malcolmNavigationPath,
  malcolmResetBlocks,
  malcolmSetDisconnected,
  malcolmMainAttribute,
  malcolmLayoutUpdatePosition,
  malcolmSelectBlock,
  malcolmSelectLink,
  malcolmLayoutShiftIsPressed,
  malcolmPostAction,
  malcolmRevertAction,
};
