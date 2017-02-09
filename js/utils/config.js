/**
 * Created by Ian Gillingham on 16/09/16.
 */

let config = {

  setProtocolVersion: function(protocolVersion)
    {
    /* Set the Zebra or PandA communication protocol version
     */

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
    let keys = Object.keys(_protocolEnum);
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
    let keys = Object.keys(_serverURLTable);
    return(keys);
    },

  getServerName: function()
    {
    return(_serverKey);
    },

  getServerURL: function()
    {
    let url = _serverURLTable[_serverKey];
    return(url);
    },

  getDeviceName: function()
  {
    return(_deviceName);
  },

  setdeviceName: function(name)
  {
      _deviceName = name;
  },

  testparams: {maxBlocks: 10}

};

let _protocolEnum = Object.freeze({V1_0: 0, V2_0: 1});

/* Set default protocol */
let _protocolKey = _protocolEnum.V2_0;

let _serverURLTable = Object.freeze({ pc70:'ws://pc0070.cs.diamond.ac.uk:8080/ws',
                                      isaDev:'ws://172.23.252.202/ws',
                                      isaSpare:'ws://172.23.252.201/ws',
                                      simulator:'ws://localhost:8080/ws'});

/* Default server URL to PC0070 - Ian's local machine */
let _serverKey = 'simulator';

let _deviceName = 'P';

export default config;
