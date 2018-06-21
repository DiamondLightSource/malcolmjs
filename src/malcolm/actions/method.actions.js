import { MalcolmAttributeData } from '../malcolm.types';

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

export default {
  buildMethodUpdate,
};
