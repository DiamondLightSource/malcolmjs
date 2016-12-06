/**
 * Created by twi18192 on 03/03/16.
 */


var idLookupTableFunctions = {

  invokeIdCallback: function (id, success, json)
    {
    /* 'success' will be a boolean value;
     if 'success' is true then invoke the success callback,
     and if it's false then invoke the failure callback
     */

    //window.alert("look at the lookup table!");
    //console.log("idLookupTableFunctions.invokeIdCallback( id, success, json)  json -> :");
    //console.log(JSON.parse(JSON.stringify(json)));

    if (success === true)
      {
      //console.log(`idLookupTableFunctions idLookupTable = ${idLookupTable}`);
      if (idLookupTable.hasOwnProperty(id))
        {
        console.log(`idLookupTableFunctions: invokeIdCallback() -> id = ${id}  is Array? -> ${Array.isArray(idLookupTable)}`);
        //console.log('idLookupTable[] ->');
        //console.log(idLookupTable);
        idLookupTable[id].successCallback(id, json);
        //console.log('idLookupTableFunctions.invokeIdCallback: ID: ' + id +' JSON: ' + json);
        }
      }
    else if (success === false)
      {
      if (idLookupTable.hasOwnProperty(id))
        {
        idLookupTable[id].failureCallback(json);
        }
      }
    },

  /**
   * @name addIdCallbacks
   * @param {number} id - unique identifier for this callback
   */
  addIdCallbacks: function (id, requestedData, callbacks)
    {
    //
    idLookupTable[id] = callbacks;
    idLookupTable[id].id = id;
    idLookupTable[id].requestMessage = requestedData;

    /**
    if (callbacks.hasOwnProperty('successCallback'))
      {
      idLookupTable[id].successCallback.bind(null, id)
      }
     *
     */
    },

  /**
   Test for table having an entry for the given id number.
   @name hasId
   @param {number} id
   @returns {bool} true if the id exiss
 */
  hasId: function(id)
    {
    return( idLookupTable.hasOwnProperty(id));
    },

  getRequestMessage: function (id)
    {
    let reqMsg = null;

    if (idLookupTable.hasOwnProperty(id))
      {
      reqMsg = idLookupTable[id].requestMessage;
      }
    return(reqMsg);
    }
};

var idLookupTable = {};

module.exports = idLookupTableFunctions;
