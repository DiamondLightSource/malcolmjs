import {
  MalcolmArchiveMethodRun,
  MalcolmAttributeData,
  MalcolmUpdateMethodInputType,
} from '../malcolm.types';

export const buildMethodUpdate = (id, data) => ({
  type: MalcolmAttributeData,
  payload: {
    id,
    ...data,
    delta: true,
    calculated: {
      isMethod: true,
      inputs: {},
      outputs: {},
      pending: false,
    },
  },
});

export const malcolmUpdateMethodInput = (path, name, value) => ({
  type: MalcolmUpdateMethodInputType,
  payload: {
    path,
    name,
    value,
  },
});

export const malcolmArchivePost = (path, parameters) => ({
  type: MalcolmArchiveMethodRun,
  payload: {
    path,
    parameters,
  },
});

export const malcolmIntialiseMethodParam = (path, selectedParam) => ({
  type: MalcolmUpdateMethodInputType,
  payload: {
    doInitialise: true,
    path,
    name: selectedParam[0] === 'takes' ? selectedParam[1] : undefined,
  },
});

export default {
  buildMethodUpdate,
  malcolmUpdateMethodInput,
};
