import { openParentPanelType } from './viewState.actions';

const initialViewState = {
  openParentPanel: true,
  openChildPanel: true,
};

const viewStateReducer = (state = initialViewState, action) => {
  switch (action.type) {
    case openParentPanelType:
      return { ...state, openParentPanel: action.openParentPanel };

    default:
      return state;
  }
};

export default viewStateReducer;
