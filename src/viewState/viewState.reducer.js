import {
  openParentPanelType,
  openHeaderType,
  updateVersionNumerType,
  snackbar,
  showFooterType,
  popout,
  panelDirection,
  mobileViewIndexType,
} from './viewState.actions';

const initialViewState = {
  openParentPanel: true,
  openChildPanel: true,
  openHeaderBar: true,
  snackbar: {
    message: '',
    open: false,
  },
  footerHeight: 0,
  transitionParent: false,
  mobileViewIndex: undefined,
};

const viewStateReducer = (state = initialViewState, action = {}) => {
  switch (action.type) {
    case openParentPanelType:
      return { ...state, openParentPanel: action.openParentPanel };
    case openHeaderType:
      return { ...state, openHeaderBar: action.openHeader };
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

    case showFooterType:
      return {
        ...state,
        footerHeight: action.payload.footerHeight || 0,
      };

    case popout:
      return {
        ...state,
        popout: true,
      };
    case panelDirection:
      return {
        ...state,
        transitionParent: action.payload.transition,
      };
    case mobileViewIndexType:
      return {
        ...state,
        mobileViewIndex: action.payload.index,
      };
    default:
      return state;
  }
};

export default viewStateReducer;
