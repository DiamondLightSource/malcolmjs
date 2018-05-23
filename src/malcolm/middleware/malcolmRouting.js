import {
  malcolmNewBlockAction,
  malcolmSubscribeAction,
  malcolmNavigationPath,
} from '../malcolmActionCreators';

const handleLocationChange = (path, dispatch) => {
  // remove the first part of the url e.g. /gui/ or /details/
  const tokens = path
    .replace(/\/$/, '')
    .split('/')
    .slice(2);
  dispatch(malcolmNavigationPath(tokens));

  // Get the root list of blocks
  dispatch(malcolmNewBlockAction('.blocks', false, false));
  dispatch(malcolmSubscribeAction(['.', 'blocks']));

  // TODO: handle layout routing

  for (let i = 0; i < tokens.length; i += 1) {
    if (i % 2 === 0) {
      const isChild =
        i === tokens.length - 2 + tokens.length % 2 && tokens.length > 2;
      const isParent =
        i === tokens.length - 4 + tokens.length % 2 ||
        (i === 0 && tokens.length <= 2);

      dispatch(malcolmNewBlockAction(tokens[i], isParent, isChild));
      dispatch(malcolmSubscribeAction([tokens[i], 'meta']));
    }
  }
};

export default handleLocationChange;
