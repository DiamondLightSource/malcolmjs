/**
 * Created by Ian Gillingham on 16/09/16.
 */

var config = {

  setProtocolVersion: function(protocolVersion)
    {
    /* Set the Zebra or PandA communication protocol version
     */
    console.log("config.setProtocolVersion(): "+ protocolVersion);

    if (protocolVersion in _protocolEnum)
      {
      _protocolKey = protocolVersion;
      }
    },

  getProtocolVersion: function()
  {
    /* Get the Zebra or PandA communication protocol version
     */
    return _protocolKey;
  },

  getProtocolVersionList: function()
    {
    var keys = Object.keys(_protocolEnum);
    return(keys);
    },

  setServerName: function(name)
    {
      if (name in _serverURLTable)
        {
        _serverKey = name;
        }
    },

  getServerNameList: function()
    {
    var keys = Object.keys(_serverURLTable);
    return(keys);
    },

  getServerName: function()
    {
    return(_serverKey);
    },

  getServerURL: function()
    {
    var url = _serverURLTable[_serverKey];
    return(url);
    },

  getDeviceName: function()
  {
    return(_deviceName);
  },

  setdeviceName: function(name)
  {
      _deviceName = name;
  }

};

var _protocolEnum = Object.freeze({V1_0: 0, V2_0: 1});

/* Set default protocol */
var _protocolKey = _protocolEnum.V1_0;

var _serverURLTable = Object.freeze({pc70:'ws://pc0070:8080/ws',
                       isaDev:'ws://172.23.252.202/ws' });

/* Default server URL to PC0070 - Ian's local machine */
var _serverKey = 'isaDev';

var _deviceName = 'Z';

module.exports = config;
