import {
  openParentPanelType,
  updateVersionNumerType,
  snackbar,
  showFooterType,
  updateTheme,
  setTheme,
  editTheme,
} from './viewState.actions';
import { theme } from '../mainMalcolmView/connectedThemeProvider';

const initialViewState = {
  openParentPanel: true,
  openChildPanel: true,
  snackbar: {
    message: '',
    open: false,
  },
  theme: {},
  footerHeight: 0,
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

    case showFooterType:
      return {
        ...state,
        footerHeight: action.payload.footerHeight || 0,
      };

    case setTheme: {
      const newTheme = state.theme;
      newTheme[action.payload.property] = action.payload.value;
      return {
        ...state,
        theme: newTheme,
      };
    }
    case updateTheme: {
      const { primary, secondary, type } = state.theme;
      window.localStorage.setItem(
        `MalcolmJsMuiTheme`,
        JSON.stringify({ primary, secondary, type })
      );
      return {
        ...state,
        theme: {
          ...state.theme,
          muiTheme: theme(
            state.theme.primary,
            state.theme.secondary,
            state.theme.type
          ),
        },
      };
    }
    case editTheme:
      return {
        ...state,
        themeEditor: action.payload.open,
      };
    default:
      return state;
  }
};

export default viewStateReducer;
