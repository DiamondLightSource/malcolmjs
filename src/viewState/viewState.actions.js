export const openParentPanelType = 'OPEN_PARENT_PANEL';
export const updateVersionNumerType = 'UPDATE_VERSION';
export const showFooterType = 'SHOW_FOOTER_TYPE';
export const snackbar = 'PUSH_SNACKBAR';
export const newTheme = 'CREATE_NEW_THEME';

export const openParentPanel = open => ({
  type: openParentPanelType,
  openParentPanel: open,
});

export const snackbarState = (open, message) => ({
  type: snackbar,
  snackbar: {
    open,
    message,
  },
});

export const updateVersionNumber = (version, title) => ({
  type: updateVersionNumerType,
  payload: {
    version,
    title,
  },
});

export const showFooterAction = footerHeight => ({
  type: showFooterType,
  payload: {
    footerHeight,
  },
});

export const newThemeAction = (type, color) => ({
  type: newTheme,
  payload: {
    type,
    color,
  },
});

export default {
  openParentPanel,
};
