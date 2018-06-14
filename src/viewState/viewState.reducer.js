import {
  openParentPanelType,
  updateVersionNumerType,
} from './viewState.actions';

const initialViewState = {
  openParentPanel: true,
  openChildPanel: true,
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

    default:
      return state;
  }
};

export default viewStateReducer;
