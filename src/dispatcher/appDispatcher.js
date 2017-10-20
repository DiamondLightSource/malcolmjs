/**
 * Created by twi18192 on 25/08/15.
 */

/**
 * Converted to ES6
 * Ian Gillingham May 2017
 *
 * @module appDispatcher
 *
 */
import {Dispatcher} from 'flux';

class DispatcherClass extends Dispatcher {

  handleAction(action)
    {
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action
    })
    }

  handleViewAction(action)
    {
    this.dispatch({
      source: "VIEW_ACTION",
      action: action
    })
    }

  handleServerAction(action)
    {
    this.dispatch({
      source: "SERVER_ACTION",
      action: action
    })
    }

  handleBlockUpdate(action)
    {
    this.dispatch({
      source: "BLOCK_UPDATE",
      action: action
    })
    }

}


const AppDispatcher = new DispatcherClass();

export default AppDispatcher;
