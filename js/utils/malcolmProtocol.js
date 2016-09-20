/**
 * Created by Ian Gillingham on 16/09/16.
 */

var Config = require('./config');

var Protocol = {};

Protocol['V1_0'] = {
  typeIdIdent : 'type',
  typeidReturn :'Return',
  typeidValue : 'Value',
  typeidError : 'Error',
  typeidGet : 'Get',
  typeidSubscribe : 'Subscribe',
  typeidCall : 'Call'

};

Protocol['V2_0'] = {
  typeIdIdent : 'typeid',
  typeidReturn : 'malcolm:core/Return:1.0',
  typeidValue : 'malcolm:core/Value:1.0',
  typeidError : 'malcolm:core/Error:1.0',
  typeidGet : 'malcolm:core/Get:1.0',
  typeidSubscribe : 'malcolm:core/Subscribe:1.0',
  typeidCall : 'malcolm:core/Call:1.0'
};

var malcolmProtocol = {
  getTypeIDIdent: function () {
    var ret = '';
    var pver = Config.getProtocolVersion();
    if (pver in Protocol)
      {
      ret = Protocol[pver].typeIdIdent;
      }
    return(ret);
  },

  getTypeIDReturn: function () {
    var ret = '';
    var pver = Config.getProtocolVersion();
    if (pver in Protocol)
      {
      ret = Protocol[pver].typeidReturn;
      }
    return(ret);
  },

  getTypeIDValue: function () {
    var ret = '';
    var pver = Config.getProtocolVersion();
    if (pver in Protocol)
      {
      ret = Protocol[pver].typeidValue;
      }
    return(ret);
  },

  getTypeIDError: function () {
    var ret = '';
    var pver = Config.getProtocolVersion();
    if (pver in Protocol)
      {
      ret = Protocol[pver].typeidError;
      }
    return(ret);
  },

  getTypeIDGet: function () {
    var ret = '';
    var pver = Config.getProtocolVersion();
    if (pver in Protocol)
    {
      ret = Protocol[pver].typeidGet;
    }
    return(ret);
  },

  getTypeIDSubscribe: function () {
    var ret = '';
    var pver = Config.getProtocolVersion();
    if (pver in Protocol)
    {
      ret = Protocol[pver].typeidSubscribe;
    }
    return(ret);
  },

  getTypeIDCall: function () {
    var ret = '';
    var pver = Config.getProtocolVersion();
    if (pver in Protocol)
    {
      ret = Protocol[pver].typeidCall;
    }
    return(ret);
  },

  isError: function (msg) {
    var bRet = false;
    var pver = Config.getProtocolVersion();
    if (pver in Protocol)
    {
      switch (pver)
      {
        case 'V1_0':
          bRet = (msg[Protocol['V1_0'].typeIdIdent] === this.getTypeIDError());
          break;
        case 'V2_0':
          bRet = (msg[Protocol['V2_0'].typeIdIdent] === this.getTypeIDError());
          break;
        default:
          break;
      }
    }
  return(bRet);
  },

  isReturn: function (msg) {
    var bRet = false;
    var pver = Config.getProtocolVersion();
    if (pver in Protocol)
    {
      switch (pver)
      {
        case 'V1_0':
          bRet = (msg[Protocol['V1_0'].typeIdIdent] === this.getTypeIDReturn());
          break;
        case 'V2_0':
          bRet = (msg[Protocol['V2_0'].typeIdIdent] === this.getTypeIDReturn());
          break;
        default:
          break;
      }
    }
    return(bRet);
  },

  isValue: function (msg) {
    var bRet = false;
    var pver = Config.getProtocolVersion();
    if (pver in Protocol)
    {
      switch (pver)
      {
        case 'V1_0':
          bRet = (msg[Protocol['V1_0'].typeIdIdent] === this.getTypeIDValue());
          break;
        case 'V2_0':
          bRet = (msg[Protocol['V2_0'].typeIdIdent] === this.getTypeIDValue());
          break;
        default:
          break;
      }
    }
    return(bRet);
  }




};

module.exports = malcolmProtocol;
