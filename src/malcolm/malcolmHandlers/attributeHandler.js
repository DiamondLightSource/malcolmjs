import { MalcolmAttributeData } from '../malcolm.types';

const processScalarAttribute = (request, changes, dispatch) => {
  const action = {
    type: MalcolmAttributeData,
    payload: {
      id: request.id,
      typeid: changes.typeid,
      delta: true,
    },
  };

  dispatch(action);
};

export default {
  processScalarAttribute,
};
