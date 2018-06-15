import { push } from 'react-router-redux';

export const openParentPanelType = 'OPEN_PARENT_PANEL';
export const openChildPanelType = 'OPEN_CHILD_PANEL';
export const updateVersionNumerType = 'UPDATE_VERSION';

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

export const updateChildPanel = (currentUrl, newChild) => {
  const tokens = currentUrl.replace(/\/$/, '').split('/');

  if (tokens[tokens.length - 1] === 'layout') {
    return push([...tokens, newChild].join('/'));
  }

  return push([...tokens.slice(0, -1), newChild].join('/'));
};

export const updateVersionNumber = version => ({
  type: updateVersionNumerType,
  payload: {
    version,
  },
});

export default {
  openParentPanel,
  closeChildPanel,
  updateChildPanel,
};
