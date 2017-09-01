/**
 * @module   optionsStore
 * @author  Ian Gillingham
 * @since  August 2017
 *
 * @description
  * The Options dispatcher listens to all actions
  * arising from user interaction which changes the
  * options interace.
  *
  * @type {[type]}
 */

import AppDispatcher from '../dispatcher/appDispatcher.js';
import appConstants from '../constants/appConstants.js';
import EventEmitter from 'events';

const CHANGE_EVENT = 'change';


class MjsOptionsStore extends EventEmitter {

  static gsFlat = 'flat';
  static gs3d   = '3d';

  constructor(props)
  {
    super(props);
    // Initialise trail from device name
    this.rightPanePinned = false;
    this.graphicsStyle = MjsOptionsStore.gs3d;
  }

  get options()
  {
    return({RightPanePinned: this.rightPanePinned,
            GraphicsStyle: this.graphicsStyle});
  }

  addChangeListener(cb)
  {
    this.on(CHANGE_EVENT, cb)
  }

  removeChangeListener(cb)
  {
    this.removeListener(CHANGE_EVENT, cb)
  }

  emitChange()
  {
    this.emit(CHANGE_EVENT)
  }
}

  const optionsStore = new MjsOptionsStore();

  optionsStore.dispatchToken = AppDispatcher.register((payload) => {
    let action = payload.action;
    let option = action.item;

    switch (action.actionType) {

      case appConstants.OPTIONS_ACTION_GSTYLE:
        this.graphicsStyle = option;
        optionsStore.emitChange();
        break;

      case appConstants.OPTIONS_ACTION_RIGHT_PINNED:
        this.rightPanePinned = option;
        optionsStore.emitChange();
        break;


      default:
        break;
    }
  });

  export {optionsStore as default, MjsOptionsStore};
