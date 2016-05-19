/**
 * Created by twi18192 on 25/08/15.
 */

var Dispatcher = require('flux').Dispatcher;
var assign = require('object-assign');

//var AppDispatcher = new Dispatcher();
//
//AppDispatcher.handleAction = function(action){
//  this.dispatch({
//    source: 'VIEW_ACTION',
//    action: action
//  })
//};

var AppDispatcher = assign(new Dispatcher(), {

  handleAction: function(action){
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action
    })
  },

  handleViewAction: function(action){
    this.dispatch({
      source: "VIEW_ACTION",
      action: action
    })
  },

  handleServerAction: function(action){
    this.dispatch({
      source: "SERVER_ACTION",
      action: action
    })
  }


});

module.exports = AppDispatcher;
