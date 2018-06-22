import createReducer from './createReducer';
import blockUtils from '../blockUtils';
import { MalcolmUpdateMethodInputType } from '../malcolm.types';

const updateMethodInput = (state, payload) => {
  const block = blockUtils.findBlock(state.blocks, payload.path[0]);
  const attributes = [...block.attributes];

  const attributeToUpdate = attributes.find(a => a.name === payload.path[1]);
  if (payload.value.isDirty !== undefined) {
    if (!attributeToUpdate.dirtyInputs) {
      attributeToUpdate.dirtyInputs = {};
    }
    attributeToUpdate.dirtyInputs[payload.name] = payload.value.isDirty;
  } else {
    attributeToUpdate.inputs[payload.name] = payload.value;
  }

  const blocks = { ...state.blocks };
  blocks[payload.path[0]] = { ...state.blocks[payload.path[0]], attributes };

  return {
    ...state,
    blocks,
  };
};

const MethodReducer = createReducer(
  {},
  {
    [MalcolmUpdateMethodInputType]: updateMethodInput,
  }
);

export default MethodReducer;
