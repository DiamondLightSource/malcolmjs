import {
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

export default {
  buildMethodUpdate,
  malcolmUpdateMethodInput,
};
