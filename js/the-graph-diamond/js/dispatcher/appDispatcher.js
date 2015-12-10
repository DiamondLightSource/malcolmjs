/**
 * Created by twi18192 on 19/11/15.
 */

var Dispatcher = require('flux').Dispatcher;
var assign = require('object-assign');

var AppDispatcher = assign(new Dispatcher(), {

    handleAction: function(action){
        this.dispatch({
            source: 'VIEW_ACTION',
            action: action
        })
    }
});

module.exports = AppDispatcher;
