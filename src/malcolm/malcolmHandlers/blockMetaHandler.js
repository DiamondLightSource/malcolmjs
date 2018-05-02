import { MalcolmBlockMeta } from '../malcolm.types';

const BlockMetaHandler = (payload, changes, dispatch) => {
  const action = {
    type: MalcolmBlockMeta,
    payload: {
      ...payload,
      delta: true,
      label: changes.label,
      fields: changes.fields,
    },
  };

  dispatch(action);
};

export default BlockMetaHandler;
