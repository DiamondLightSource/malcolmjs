import BlockUtils from '../blockUtils';
import {
  malcolmNewBlockAction,
  malcolmSubscribeAction,
} from '../malcolmActionCreators';

const layoutRouteSelected = (blocks, path, dispatch) => {
  const layoutAttribute = BlockUtils.findAttribute(blocks, path[0], path[1]);

  if (layoutAttribute && layoutAttribute.layout) {
    layoutAttribute.layout.blocks.filter(b => b.visible).forEach(block => {
      if (!blocks[block.mri]) {
        dispatch(malcolmNewBlockAction(block.mri, false, false));
        dispatch(malcolmSubscribeAction([block.mri, 'meta']));
      }
    });
  }
};

const layoutAttributeReceived = (path, getState, dispatch) => {
  const { mainAttribute, blocks } = getState().malcolm;
  const layoutAttribute = BlockUtils.findAttribute(blocks, path[0], path[1]);
  if (mainAttribute === layoutAttribute.name) {
    layoutAttribute.value.visible.forEach((visible, i) => {
      if (visible) {
        const blockName = layoutAttribute.value.mri[i];
        if (!blocks[blockName]) {
          dispatch(malcolmNewBlockAction(blockName, false, false));
          dispatch(malcolmSubscribeAction([blockName, 'meta']));
        }
      }
    });
  }
};

export default {
  layoutRouteSelected,
  layoutAttributeReceived,
};
