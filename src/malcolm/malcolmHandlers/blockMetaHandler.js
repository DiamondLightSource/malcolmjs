import { MalcolmBlockMeta, MalcolmRootBlockMeta } from '../malcolm.types';
import {
  malcolmSubscribeAction,
  malcolmNewBlockAction,
  malcolmGetAction,
} from '../malcolmActionCreators';
import { subscriptionActive } from '../middleware/malcolmReduxMiddleware';

export const rootBlockSubPath = ['.', 'blocks', 'value'];
// export const rootBlockSubPath = ['.', 'blocks'];

export const BlockMetaHandler = (
  request,
  changes,
  dispatch,
  messagesInFlight,
  doSubscribe = true,
  doGet = false
) => {
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
      if (
        !subscriptionActive(
          [...request.path.slice(0, -1), field],
          messagesInFlight
        )
      ) {
        if (doSubscribe) {
          dispatch(
            malcolmSubscribeAction([...request.path.slice(0, -1), field])
          );
        } else if (doGet) {
          dispatch(malcolmGetAction([...request.path.slice(0, -1), field]));
        }
      }
    });
  }
};

export const RootBlockHandler = (request, blocks, dispatch, state) => {
  const action = {
    type: MalcolmRootBlockMeta,
    payload: {
      id: request.id,
      blocks,
    },
  };

  dispatch(action);

  // Re-subscribe to any blocks which are in .blocks
  Object.values(state.malcolm.blocks)
    .filter(
      block =>
        block.name !== '.blocks' &&
        Object.keys(state.malcolm.blocks['.blocks'].children).includes(
          block.name
        )
    )
    .forEach(block => {
      // socket reducer/middleware already prevents duplicate subscriptions so we don't need to check here
      dispatch(malcolmSubscribeAction([block.name, 'meta']));
    });
  // once we have the list of blocks subscribe to anything in the URL that is a block
  const { navigationLists } = state.malcolm.navigation;

  for (let i = 0; i < navigationLists.length; i += 1) {
    const nav = navigationLists[i];
    if (
      !state.malcolm.blocks[nav.path] &&
      blocks.mri.findIndex(block => block === nav.path) > -1
    ) {
      dispatch(malcolmNewBlockAction(nav.path, false, false));
      dispatch(malcolmSubscribeAction([nav.path, 'meta']));
    }
  }
};

export default BlockMetaHandler;
