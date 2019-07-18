import {
  blue,
  orange,
  pink,
  purple,
  brown,
} from '@material-ui/core/colors/index';
import {
  openParentPanelType,
  openHeaderType,
  updateVersionNumerType,
  snackbar,
  showFooterType,
  updateTheme,
  setTheme,
  editTheme,
  popout,
  panelDirection,
  mobileViewIndexType,
} from './viewState.actions';
import { theme } from '../mainMalcolmView/connectedThemeProvider';

const initialViewState = {
  openParentPanel: true,
  openChildPanel: true,
  openHeaderBar: true,
  snackbar: {
    message: '',
    open: false,
  },
  theme: {
    alarmState: {
      warning: '#e6c01c',
      error: '#e8001f',
      disconnected: '#9d07bb',
    },
    // port colours should not use the themes secondary colour, it is used to highlight blocks and links
    portColours: {
      bool: blue,
      int32: orange,
      motor: pink,
      NDArray: brown,
      block: purple,
    },
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
