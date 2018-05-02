import { MalcolmSend, MalcolmNewBlock } from './malcolm.types';

export const malcolmGetAction = path => ({
  type: MalcolmSend,
  payload: {
    typeid: 'malcolm:core/Get:1.0',
    path,
  },
});

export const malcolmSubscribeAction = path => ({
  type: MalcolmSend,
  payload: {
    typeid: 'malcolm:core/Subscribe:1.0',
    path,
    delta: true,
  },
});

export const malcolmNewParentBlockAction = blockName => ({
  type: MalcolmNewBlock,
  payload: {
    blockName,
    parent: true,
    child: false,
  },
});

export default {
  malcolmGetAction,
  malcolmSubscribeAction,
  malcolmNewParentBlockAction,
};
