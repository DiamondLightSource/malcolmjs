import queryString from 'query-string';
import * as colors from '@material-ui/core/colors';
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
import {
  themeConstructor,
  defaultTheme,
} from '../mainMalcolmView/connectedThemeProvider';

const getInitialTheme = () => {
  const newTheme = JSON.parse(JSON.stringify(defaultTheme));
  const { primary, secondary, type } = queryString.parse(
    window.location.search
  );
  if (
    (!primary || (primary && Object.keys(colors).includes(primary))) &&
    (!secondary || (secondary && Object.keys(colors).includes(secondary))) &&
    (!type || (type && ['light', 'dark'].includes(type)))
  ) {
    newTheme.primary = primary || defaultTheme.primary;
    newTheme.type = type || defaultTheme.type;
    newTheme.secondary = secondary || defaultTheme.secondary;
  }
  return {
    ...newTheme,
    muiTheme: themeConstructor(
      newTheme.primary,
      newTheme.secondary,
      newTheme.type
    ),
  };
};

const initialViewState = {
  openParentPanel: true,
  openChildPanel: true,
  openHeaderBar: true,
  snackbar: {
    message: '',
    open: false,
  },
  theme: getInitialTheme(),
  footerHeight: 0,
  transitionParent: false,
  mobileViewIndex: undefined,
  version: undefined,
};

const viewStateReducer = (state = initialViewState, action = {}) => {
  switch (action.type) {
    case openParentPanelType:
      return { ...state, openParentPanel: action.openParentPanel };
    case openHeaderType:
      return { ...state, openHeaderBar: action.openHeader };
    case updateVersionNumerType: {
      if (document) {
        document.title = `${action.payload.title} ${action.payload.version}`;
      }
      return { ...state, version: action.payload.version };
    }
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
      return {
        ...state,
        theme: {
          ...state.theme,
          muiTheme: themeConstructor(
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
        themeEditor: !state.themeEditor,
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
