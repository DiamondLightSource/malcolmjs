/**
 * Created by twi18192 on 03/03/16.
 */


var idLookupTableFunctions = {

  invokeIdCallback: function(id, success, json) {
  /* 'success' will be a boolean value;
   if 'success' is true then invoke the success callback,
   and if it's false then invoke the failure callback
   */

    //window.alert("look at the lookup table!");

    if (success === true) {
      idLookupTable[id].successCallback(json);
      console.log('idLookupTableFunctions.invokeIdCallback: ID: ' + id +' JSON: ' + json);
    }
    else if (success === false) {
      idLookupTable[id].failureCallback(json)
    }
  },

  addIdCallbacks: function(id, callbacks){
    idLookupTable[id] = callbacks;
  }

};

var idLookupTable = {

};

module.exports = idLookupTableFunctions;
