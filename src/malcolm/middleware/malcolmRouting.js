import {
  malcolmNewBlockAction,
  malcolmSubscribeAction,
  malcolmNavigationPath,
} from '../malcolmActionCreators';

const handleLocationChange = (path, dispatch) => {
  // remove the first part of the url e.g. /gui/ or /details/
  const tokens = path.split('/').slice(2);
  dispatch(malcolmNavigationPath(tokens));

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
