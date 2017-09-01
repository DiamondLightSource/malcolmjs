/**
 * @module breadbin
 * @author  Ian Gillingham
 * @since  August 2017
 *
 * @description
  * The BreadBin dispatcher listens to all actions
  * arising from user interaction which changes the
  * context (target) and thus the logical URL.
  * Here we gather the information to provide a
  * breadcrumb trail, to facilitate ease of Navigation
  * to and from different levels of information.
  *
  * @type {[type]}
 */

import AppDispatcher from '../dispatcher/appDispatcher.js';
import appConstants from '../constants/appConstants.js';
import EventEmitter from 'events';
import List from "collections/list";

import "collections/shim-array"
const CHANGE_EVENT = 'change';

/**
 * Breadcrumb string constants
 * @type {String}
 */
const BC_LAYOUT = 'Layout';
let   BC_DEVICE = 'P';

class BreadBin extends EventEmitter {
  constructor(props)
  {
    super(props);
    // Initialise trail from device name
    this.breadcrumbList = [BC_DEVICE];
  }

  get breadcrumbs()
  {
    return(this.breadcrumbList.toArray());
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

  const breadBin = new BreadBin();

  breadBin.dispatchToken = AppDispatcher.register((payload) => {
    let action = payload.action;
    let item = action.item;

    switch (action.actionType) {

      case appConstants.DEVICE_SELECT:
        breadBin.breadcrumbList = [];
        breadBin.breadcrumbList.push(item);
        breadBin.emitChange();
        break;

      case
        appConstants.INITIALISE_FLOWCHART_START:
        break;

      case appConstants.SELECT_BLOCK:
        breadBin.breadcrumbList = [];
        breadBin.breadcrumbList.push(BC_LAYOUT);
        breadBin.breadcrumbList.push(item);
        breadBin.emitChange();
        break;

      case appConstants.SELECT_EDGE:
        breadBin.emitChange();
        break;

      case appConstants.DESELECT_ALLBLOCKS:
        /**
       * Implies layout selected.
       */
        breadBin.emitChange();
        break;

      default:
        break;
    }
  });

  export {breadBin as default, BreadBin};
