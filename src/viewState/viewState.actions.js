export const openParentPanelType = 'OPEN_PARENT_PANEL';
export const openHeaderType = 'OPEN_HEADER_BAR';
export const updateVersionNumerType = 'UPDATE_VERSION';
export const showFooterType = 'SHOW_FOOTER_TYPE';
export const snackbar = 'PUSH_SNACKBAR';
export const updateTheme = 'CREATE_NEW_THEME';
export const editTheme = 'EDIT_THEME';
export const setTheme = 'SET_THEME_PROPS';
export const popout = 'WINDOW_IS_POPOUT';
export const panelDirection = 'PANEL_TRANSITION_DIRECTION';
export const mobileViewIndexType = 'SET_MOBILE_VIEW_INDEX';

export const openParentPanel = open => ({
  type: openParentPanelType,
  openParentPanel: open,
});

export const openHeaderBar = open => ({
  type: openHeaderType,
  openHeader: open,
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

export const updateThemeAction = () => ({
  type: updateTheme,
});

export const setThemeAction = (property, value) => ({
  type: setTheme,
  payload: {
    property,
    value,
  },
});

export const editThemeAction = open => ({
  type: editTheme,
  payload: {
    open,
  },
});
export const flagAsPopout = () => ({
  type: popout,
});

export const parentPanelTransition = transition => ({
  type: panelDirection,
  payload: {
    transition,
  },
});

export const setMobileViewIndex = index => ({
  type: mobileViewIndexType,
  payload: { index },
});
export default {
  openParentPanel,
};
