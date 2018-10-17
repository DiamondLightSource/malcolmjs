import {
  MalcolmArchiveMethodRun,
  MalcolmAttributeData,
  MalcolmFlagMethodInputType,
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

export const malcolmIntialiseMethodParam = (path, selectedParam) => ({
  type: MalcolmUpdateMethodInputType,
  payload: {
    doInitialise: true,
    path,
    name: selectedParam[0] === 'takes' ? selectedParam[1] : undefined,
  },
});

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
