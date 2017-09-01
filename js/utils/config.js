/**
 * Created by Ian Gillingham on 16/09/16.
 */

/**
 * @module exports a singleton instance of Config class
 *
 */
const __port_colour = {
  'bool'   : '#4921DB',
  'int32'  : '#DB8C1D',
  'default': '#000000'
};

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
  this._protocolEnum = Object.freeze({V1_0: 0, V2_0: 1});

  /* Set default protocol */
  this._protocolKey = this._protocolEnum.V2_0;

  this._serverURLTable = Object.freeze({
    pc70     : 'ws://pc0070.cs.diamond.ac.uk:8080/ws',
    pc4      : 'ws://pc0004.cs.diamond.ac.uk:8080/ws',
    isaDev   : 'ws://172.23.252.202/ws',
    isaSpare : 'ws://172.23.252.201/ws',
    simulator: 'ws://localhost:8080/ws'
  });

  /* Default server URL to PC0070 - Ian's local machine */
  this._serverKey = 'simulator';

  this._deviceName = 'P';

  this.testparams = {maxBlocks: 10};
  }

setProtocolVersion(protocolVersion)
  {
  /* Set the Zebra or PandA communication protocol version
   */

  if (protocolVersion in this._protocolEnum)
    {
    this._protocolKey = protocolVersion;
    }
  }

getProtocolVersion()
  {
  /* Get the Zebra or PandA communication protocol version
   */
  return this._protocolKey;
  }

getProtocolVersionList()
  {
  let keys = Object.keys(this._protocolEnum);
  return (keys);
  }

setServerName(name)
  {
  if (name in this._serverURLTable)
    {
    this._serverKey = name;
    }
  }

getServerNameList()
  {
  let keys = Object.keys(this._serverURLTable);
  return (keys);
  }

getServerName()
  {
  return (this._serverKey);
  }

getServerURL()
  {
  let url = this._serverURLTable[this._serverKey];
  return (url);
  }

getDeviceName()
  {
  return (this._deviceName);
  }

setdeviceName(name)
  {
  this._deviceName = name;
  }

/**
 *
 * @param {string} portType
 * @desc can presently be either 'bool' or 'int32'. If an unknown type is passes then the colour will default to black.
 *
 */
getPortColour(portType)
  {
  let returnColour = __port_colour.default;

  if (typeof(portType) === "string")
    {
    if (__port_colour.hasOwnProperty(portType))
      {
      returnColour = __port_colour[portType];
      }
    }
  return (returnColour);
  }


}

let config = new Config();

export default config;
