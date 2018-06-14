import {
  openParentPanelType,
  updateVersionNumerType,
  siteLoadingType,
} from './viewState.actions';

const initialViewState = {
  openParentPanel: true,
  openChildPanel: true,
  siteLoading: true,
};

const viewStateReducer = (state = initialViewState, action) => {
  switch (action.type) {
    case openParentPanelType:
      return { ...state, openParentPanel: action.openParentPanel };

    case updateVersionNumerType:
      if (document) {
        document.title = `MalcolmJS ${action.payload.version}`;
      }
      return state;

    case siteLoadingType:
      return {
        ...state,
        siteLoading: action.payload.siteLoading,
      };

    default:
      return state;
  }
};

export default viewStateReducer;
