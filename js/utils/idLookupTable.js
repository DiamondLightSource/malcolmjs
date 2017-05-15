/**
 * Created by twi18192 on 03/03/16.
 */


class IdLookupTableFunctions {

constructor()
  {
  this.idLookupTable = {};
  }

/**
 * @name  invokeIdCallback
 * @param id
 * @param success
 * @param json
 */
invokeIdCallback(id, success, json)
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
    //console.log(`idLookupTableFunctions idLookupTable = ${this.idLookupTable}`);
    if (this.idLookupTable.hasOwnProperty(id.toString()))
      {
      //console.log(`idLookupTableFunctions: invokeIdCallback() -> id = ${id}  is Array? -> ${Array.isArray(this.idLookupTable)}`);
      //console.log('idLookupTable[] ->');
      //console.log(this.idLookupTable);
      this.idLookupTable[id].successCallback(id, json);
      //console.log('idLookupTableFunctions.invokeIdCallback: ID: ' + id +' JSON: ' + json);
      }
    }
  else if (success === false)
    {
    if (this.idLookupTable.hasOwnProperty(id.toString()))
      {
      this.idLookupTable[id].failureCallback(json);
      }
    }
  }

/**
 * @name addIdCallbacks
 * @param {number} id - unique identifier for this callback
 * @param {object} requestedData
 * @param {array} callbacks
 */
addIdCallbacks(id, requestedData, callbacks)
  {
  //
  this.idLookupTable[id]                = callbacks;
  this.idLookupTable[id].id             = id;
  this.idLookupTable[id].requestMessage = requestedData;

  /**
   if (callbacks.hasOwnProperty('successCallback'))
   {
   this.idLookupTable[id].successCallback.bind(null, id)
   }
   *
   */
  }

/**
 * @name  removeIdCallback
 * @param id
 *
 * @description  Deallocate callbacks mapped to message IDs and return the ID to the pool.
 *
 */
removeIdCallback(id)
  {
  if (this.hasId(id))
    {
    this.idLookupTable.delete(id.toString());
    }
  }

/**
 Test for table having an entry for the given id number.
 @name hasId
 @param {number} id
 @returns {boolean} true if the id exiss
 */
hasId(id)
  {
  return ( this.idLookupTable.hasOwnProperty(id.toString()));
  }

getRequestMessage(id)
  {
  let reqMsg = null;

  if (this.idLookupTable.hasOwnProperty(id.toString()))
    {
    reqMsg = this.idLookupTable[id].requestMessage;
    }
  return (reqMsg);
  }
}

let idLookupTableFunctions = new IdLookupTableFunctions();

export default idLookupTableFunctions;

