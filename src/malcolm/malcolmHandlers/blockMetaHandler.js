import { MalcolmBlockMeta } from '../malcolm.types';
import { malcolmSubscribeAction } from '../malcolmActionCreators';

const BlockMetaHandler = (request, changes, dispatch) => {
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

export default BlockMetaHandler;
