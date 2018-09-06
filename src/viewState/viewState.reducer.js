import {
  openParentPanelType,
  updateVersionNumerType,
  snackbar,
} from './viewState.actions';

const initialViewState = {
  openParentPanel: true,
  openChildPanel: true,
  snackbar: {
    message: '',
    open: false,
  },
};

const viewStateReducer = (state = initialViewState, action = {}) => {
  switch (action.type) {
    case openParentPanelType:
      return { ...state, openParentPanel: action.openParentPanel };

    case updateVersionNumerType:
      if (document) {
        document.title = `${action.payload.title} ${action.payload.version}`;
      }
      return state;

    case snackbar:
      return {
        ...state,
        snackbar: { ...action.snackbar },
      };

    default:
      return state;
  }
};

export default viewStateReducer;
