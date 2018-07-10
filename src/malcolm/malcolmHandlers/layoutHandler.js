import BlockUtils from '../blockUtils';
import {
  malcolmNewBlockAction,
  malcolmSubscribeAction,
} from '../malcolmActionCreators';

const layoutRouteSelected = (blocks, blockName, dispatch) => {
  const layoutAttribute = BlockUtils.findAttribute(blocks, blockName, 'layout');

  if (layoutAttribute && layoutAttribute.layout) {
    layoutAttribute.layout.blocks.filter(b => b.visible).forEach(block => {
      dispatch(malcolmNewBlockAction(block.mri, false, false));
      dispatch(malcolmSubscribeAction([block.mri, 'meta']));
    });
  }
};

const layoutAttributeReceived = (layoutAttribute, dispatch) => {
  layoutAttribute.value.visible.forEach((visible, i) => {
    if (visible) {
      const blockName = layoutAttribute.value.mri[i];
      dispatch(malcolmNewBlockAction(blockName, false, false));
      dispatch(malcolmSubscribeAction([blockName, 'meta']));
    }
  });
};

export default {
  layoutRouteSelected,
  layoutAttributeReceived,
};
