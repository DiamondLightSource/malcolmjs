import { openParentPanelType, openChildPanelType } from './viewState.actions';

const initialViewState = {
  openParentPanel: true,
  openChildPanel: true,
};

const viewStateReducer = (state = initialViewState, action) => {
  switch (action.type) {
    case openParentPanelType:
      return { ...state, openParentPanel: action.openParentPanel };

    case openChildPanelType:
      return { ...state, openChildPanel: action.openChildPanel };

    default:
      return state;
  }
};

export default viewStateReducer;
