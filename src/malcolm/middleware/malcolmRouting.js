import {
  malcolmNewBlockAction,
  malcolmSubscribeAction,
  malcolmNavigationPath,
  malcolmMainAttribute,
} from '../malcolmActionCreators';
import LayoutHandler from '../malcolmHandlers/layoutHandler';

const handleLocationChange = (path, blocks, dispatch) => {
  // remove the first part of the url e.g. /gui/ or /details/
  const tokens = path
    .replace(/\/$/, '') // strip off the trailing /
    .split('/')
    .slice(2);
  dispatch(malcolmNavigationPath(tokens));

  // Get the root list of blocks
  dispatch(malcolmNewBlockAction('.blocks', false, false));
  dispatch(malcolmSubscribeAction(['.', 'blocks'], false));

  for (let i = 0; i < tokens.length; i += 1) {
    if (i % 2 === 0) {
      const isChild =
        i === tokens.length - 2 + tokens.length % 2 && tokens.length > 2;
      const isParent =
        i === tokens.length - 4 + tokens.length % 2 ||
        (i === 0 && tokens.length <= 2);

      dispatch(malcolmNewBlockAction(tokens[i], isParent, isChild));
      dispatch(malcolmSubscribeAction([tokens[i], 'meta']));
    } else {
      const isMainAttribute =
        i === tokens.length - 1 - tokens.length % 2 ||
        (i === 1 && tokens.length <= 2);
      if (isMainAttribute) {
        if (tokens[i] === 'layout') {
          LayoutHandler.layoutRouteSelected(blocks, tokens[i - 1], dispatch);
        }

        dispatch(malcolmMainAttribute(tokens[i]));
      }
    }
  }
};

export default handleLocationChange;
