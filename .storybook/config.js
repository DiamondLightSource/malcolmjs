import { configure } from '@kadira/storybook';

function loadStories() {
  require('../components/stories/button');
  require('../components/stories/reacttoolbox');
  require('../components/stories/toggle_grommet');
  require('../components/stories/list_grommet');
  require('../components/stories/rebass');
  require('../components/stories/toggle_belle');
  // require as many stories as you need.
}

configure(loadStories, module);

