import {
  MalcolmAttributeData,
  MalcolmUpdateMethodInputType,
} from '../malcolm.types';

export const buildMethodUpdate = (id, data) => ({
  type: MalcolmAttributeData,
  payload: {
    id,
    ...data,
    isMethod: true,
    inputs: {},
    outputs: {},
    delta: true,
    pending: false,
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
