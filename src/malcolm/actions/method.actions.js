import {
  MalcolmArchiveMethodRun,
  MalcolmAttributeData,
  MalcolmFlagMethodInputType,
  MalcolmUpdateMethodInputType,
} from '../malcolm.types';
import blockUtils from '../blockUtils';

export const buildMethodUpdate = (id, data) => ({
  type: MalcolmAttributeData,
  payload: {
    id,
    ...data,
    delta: true,
    calculated: {
      isMethod: true,
      pending: false,
    },
  },
});

export const malcolmUpdateMethodInput = (
  path,
  name,
  value,
  forceUpdate = false
) => ({
  type: MalcolmUpdateMethodInputType,
  payload: {
    path,
    name,
    value,
    forceUpdate,
  },
});

export const malcolmClearMethodInput = (path, name) => ({
  type: MalcolmUpdateMethodInputType,
  payload: {
    path,
    name,
    delete: true,
  },
});

export const malcolmArchivePost = (path, parameters) => ({
  type: MalcolmArchiveMethodRun,
  payload: {
    path,
    parameters,
  },
});

export const malcolmIntialiseMethodParam = (path, selectedParam) => (
  dispatch,
  getState
) => {
  const { blocks } = getState().malcolm;
  const method = blockUtils.findAttribute(blocks, path[0], path[1]);
  if (
    (method &&
      method.calculated.isMethod &&
      selectedParam[0] === 'takes' &&
      !method.calculated.inputs[selectedParam[1]]) ||
    (method.calculated.inputs[selectedParam[1]] instanceof Object &&
      !Object.prototype.hasOwnProperty.call(
        method.calculated.inputs[selectedParam[1]],
        'value'
      ))
  )
    dispatch({
      type: MalcolmUpdateMethodInputType,
      payload: {
        doInitialise: true,
        path,
        name: selectedParam[1],
      },
    });
};

export const malcolmFlagMethodInput = (path, name, flagType, flagState) => ({
  type: MalcolmFlagMethodInputType,
  payload: {
    path,
    name,
    flagType,
    flagState,
  },
});

export default {
  buildMethodUpdate,
  malcolmUpdateMethodInput,
};
