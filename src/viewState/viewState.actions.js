import { push } from 'react-router-redux';

export const openParentPanelType = 'OPEN_PARENT_PANEL';
export const openChildPanelType = 'OPEN_CHILD_PANEL';

export const openParentPanel = open => ({
  type: openParentPanelType,
  openParentPanel: open,
});

export const closeChildPanel = currentUrl => {
  const urlWithoutChild = currentUrl
    .replace(/\/$/, '')
    .split('/')
    .slice(0, -1)
    .join('/');
  return push(urlWithoutChild);
};

export default { openParentPanel, closeChildPanel };
