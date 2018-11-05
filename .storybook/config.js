import { configure } from '@storybook/react';
import { setDefaults } from '@storybook/addon-info';

// addon-info
setDefaults({
  inline: true
});

function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);

