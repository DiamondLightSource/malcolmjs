/**
 * Created by Ian Gillingham on 16/09/16.
 */

import config from './config';

var Protocol = {};

Protocol['V1_0'] = {
  typeIdIdent    : 'type',
  typeidReturn   : 'Return',
  typeidValue    : 'Value',
  typeidError    : 'Error',
  typeidGet      : 'Get',
  typeidSubscribe: 'Subscribe',
  typeidCall     : 'Call'

};

Protocol['V2_0'] = {
  typeIdIdent    : 'typeid',
  typeidReturn   : 'malcolm:core/Return:1.0',
  typeidValue    : 'malcolm:core/Value:1.0',
  typeidUpdate   : 'malcolm:core/Update:1.0',
  typeidError    : 'malcolm:core/Error:1.0',
  typeidGet      : 'malcolm:core/Get:1.0',
  typeidSubscribe: 'malcolm:core/Subscribe:1.0',
  typeidCall     : 'malcolm:core/Call:1.0'
};

// It is intended to support only one protocol, so no choice will be available.
// So assume V2_0 as the default.
export const ProtocolTypeId = {
  typeIdIdent    : 'typeid',
  typeidReturn   : 'malcolm:core/Return:1.0',
  typeidValue    : 'malcolm:core/Value:1.0',
  typeidUpdate   : 'malcolm:core/Update:1.0',
  typeidError    : 'malcolm:core/Error:1.0',
  typeidGet      : 'malcolm:core/Get:1.0',
  typeidSubscribe: 'malcolm:core/Subscribe:1.0',
  typeidCall     : 'malcolm:core/Call:1.0'
};

class MalcolmProtocol {

getTypeIDIdent()
  {
  var ret = ProtocolTypeId.typeIdIdent;
  return (ret);
  }

getTypeIDReturn()
  {
  var ret = ProtocolTypeId.typeidReturn;
  return (ret);
  }

getTypeIDValue()
  {
  var ret = ProtocolTypeId.typeidValue;
  return (ret);
  }

getTypeIDUpdate()
  {
  var ret = ProtocolTypeId.typeidUpdate;
  return (ret);
  }

getTypeIDError()
  {
  var ret = ProtocolTypeId.typeidError;
  return (ret);
  }

getTypeIDGet()
  {
  var ret = ProtocolTypeId.typeidGet;
  return (ret);
  }

getTypeIDSubscribe()
  {
  var ret = ProtocolTypeId.typeidSubscribe;
  return (ret);
  }

getTypeIDCall()
  {
  var ret = ProtocolTypeId.typeidCall;
  return (ret);
  }

isError(msg)
  {
  var bRet = (msg[ProtocolTypeId.typeIdIdent] === this.getTypeIDError());
  return (bRet);
  }

isReturn(msg)
  {
  var bRet = (msg[Protocol['V2_0'].typeIdIdent] === this.getTypeIDReturn());
  return (bRet);
  }

isValue(msg)
  {
  var bRet = (msg[Protocol['V2_0'].typeIdIdent] === this.getTypeIDValue());
  return (bRet);
  }

isUpdate(msg)
  {
  var bRet = (msg[Protocol['V2_0'].typeIdIdent] === this.getTypeIDUpdate());
  return (bRet);
  }


}

var malcolmProtocol = new MalcolmProtocol();

export default malcolmProtocol;
