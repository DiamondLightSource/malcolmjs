export const openParentPanelType = 'OPEN_PARENT_PANEL';
export const updateVersionNumerType = 'UPDATE_VERSION';
export const snackbar = 'PUSH_SNACKBAR';

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

export const updateVersionNumber = version => ({
  type: updateVersionNumerType,
  payload: {
    version,
  },
});

export default {
  openParentPanel,
};
