/**
 * Created by Ian Gillingham on 16/09/16.
 */

/**
 * @module exports a singleton instance of Config class
 *
 * @class Config
 * @description  Provides essential run-time configuration information for MalcolmJS
 *
 */
class Config {
constructor()
  {
  this._serverURLTable = Object.freeze({
    pc70     : 'ws://pc0070.cs.diamond.ac.uk:8080/ws',
    pc4      : 'ws://pc0004.cs.diamond.ac.uk:8080/ws',
    isaDev   : 'ws://172.23.252.202/ws',
    isaSpare : 'ws://172.23.252.201/ws',
    simulator: 'ws://localhost:8080/ws'
  });

  /* Default server URL to PC0070 - Ian's local machine */
  this._serverKey = 'simulator';

  }

getServerURL()
  {
  let url = this._serverURLTable[this._serverKey];
  return (url);
  }




}

let config = new Config();

export default config;
