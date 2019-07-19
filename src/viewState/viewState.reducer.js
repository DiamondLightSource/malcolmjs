import queryString from 'query-string';
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

const initialViewState = {
  openParentPanel: true,
  openChildPanel: true,
  openHeaderBar: true,
  snackbar: {
    message: '',
    open: false,
  },
  theme: {
    ...JSON.parse(JSON.stringify(defaultTheme)),
    muiTheme: themeConstructor(
      defaultTheme.primary,
      defaultTheme.secondary,
      defaultTheme.type
    ),
  },
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
      const newTheme = state.theme;
      if (document) {
        document.title = `${action.payload.title} ${action.payload.version}`;
        const { primary, secondary, type } = queryString.parse(
          window.location.search
        );
        newTheme.primary = primary || defaultTheme.primary;
        newTheme.type = type || defaultTheme.type;
        newTheme.secondary = secondary || defaultTheme.secondary;
        newTheme.muiTheme = themeConstructor(
          newTheme.primary,
          newTheme.secondary,
          newTheme.type
        );
      }
      return { ...state, version: action.payload.version, theme: newTheme };
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
