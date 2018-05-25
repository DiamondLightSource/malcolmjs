import { MalcolmAttributeData } from '../malcolm.types';

const processScalarAttribute = (request, changes, dispatch) => {
  const inGroup = changes.meta.tags.some(t => t.indexOf('group:') > -1);
  const group = inGroup
    ? changes.meta.tags
        .find(t => t.indexOf('group:') > -1)
        .replace('group:', '')
    : '';

  const action = {
    type: MalcolmAttributeData,
    payload: {
      id: request.id,
      typeid: changes.typeid,
      isGroup: changes.meta.tags.some(t => t === 'widget:group'),
      inGroup,
      group,
      meta: changes.meta,
      alarm: changes.alarm,
      value: changes.value,
      delta: true,
      pending: false,
    },
  };

  dispatch(action);
};

export default {
  processScalarAttribute,
};
