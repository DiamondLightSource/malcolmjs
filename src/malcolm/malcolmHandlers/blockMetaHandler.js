import { MalcolmBlockMeta, MalcolmRootBlockMeta } from '../malcolm.types';
import { malcolmSubscribeAction } from '../malcolmActionCreators';

export const BlockMetaHandler = (request, changes, dispatch) => {
  const action = {
    type: MalcolmBlockMeta,
    payload: {
      id: request.id,
      typeid: changes.typeid,
      delta: true,
      label: changes.label,
      fields: changes.fields,
    },
  };

  dispatch(action);

  if (changes.fields) {
    changes.fields.forEach(field => {
      dispatch(malcolmSubscribeAction([...request.path.slice(0, -1), field]));
    });
  }
};

export const RootBlockHandler = (request, blocks, dispatch) => {
  const action = {
    type: MalcolmRootBlockMeta,
    payload: {
      id: request.id,
      blocks,
    },
  };

  dispatch(action);
};

export default BlockMetaHandler;
