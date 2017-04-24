/**
 * Created by twi18192 on 25/08/15.
 */

let Dispatcher = require('flux').Dispatcher;
let assign     = require('object-assign');

//let AppDispatcher = new Dispatcher();
//
//AppDispatcher.handleAction = function(action){
//  this.dispatch({
//    source: 'VIEW_ACTION',
//    action: action
//  })
//};

let AppDispatcher = assign(new Dispatcher(), {

  handleAction: function (action)
    {
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action
    })
    },

  handleViewAction: function (action)
    {
    this.dispatch({
      source: "VIEW_ACTION",
      action: action
    })
    },

  handleServerAction: function (action)
    {
    this.dispatch({
      source: "SERVER_ACTION",
      action: action
    })
    },

  handleBlockUpdate: function (action)
    {
    this.dispatch({
      source: "BLOCK_UPDATE",
      action: action
    })
    }

});

module.exports = AppDispatcher;
