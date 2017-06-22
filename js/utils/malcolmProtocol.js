/**
 * Created by Ian Gillingham on 16/09/16.
 */

import config from './config';

let Protocol = {};

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
  typeIdIdent      : 'typeid',
  typeidReturn     : 'malcolm:core/Return:1.0',
  typeidValue      : 'malcolm:core/Value:1.0',
  typeidUpdate     : 'malcolm:core/Update:1.0',
  typeidError      : 'malcolm:core/Error:1.0',
  typeidGet        : 'malcolm:core/Get:1.0',
  typeidSubscribe  : 'malcolm:core/Subscribe:1.0',
  typeidUnsubscribe: 'malcolm:core/Unubscribe:1.0',
  typeidPost       : 'malcolm:core/Post:1.0',
  typeidPut        : 'malcolm:core/Put:1.0',
  typeidBlock      : 'malcolm:core/Block:1.0'
};

// It is intended to support only one protocol, so no choice will be available.
// So assume V2_0 as the default.
export const ProtocolTypeId = {
  typeIdIdent      : 'typeid',
  typeidReturn     : 'malcolm:core/Return:1.0',
  typeidValue      : 'malcolm:core/Value:1.0',
  typeidUpdate     : 'malcolm:core/Update:1.0',
  typeidError      : 'malcolm:core/Error:1.0',
  typeidGet        : 'malcolm:core/Get:1.0',
  typeidSubscribe  : 'malcolm:core/Subscribe:1.0',
  typeidUnsubscribe: 'malcolm:core/Unubscribe:1.0',
  typeidPost       : 'malcolm:core/Post:1.0',
  typeidPut        : 'malcolm:core/Put:1.0',
  typeidBlock      : 'malcolm:core/Block:1.0'
};

class MalcolmProtocol {

getTypeIDIdent()
  {
  let ret = ProtocolTypeId.typeIdIdent;
  return (ret);
  }

getTypeIDReturn()
  {
  let ret = ProtocolTypeId.typeidReturn;
  return (ret);
  }

getTypeIDValue()
  {
  let ret = ProtocolTypeId.typeidValue;
  return (ret);
  }

getTypeIDUpdate()
  {
  let ret = ProtocolTypeId.typeidUpdate;
  return (ret);
  }

getTypeIDError()
  {
  let ret = ProtocolTypeId.typeidError;
  return (ret);
  }

getTypeIDGet()
  {
  let ret = ProtocolTypeId.typeidGet;
  return (ret);
  }

getTypeIDSubscribe()
  {
  let ret = ProtocolTypeId.typeidSubscribe;
  return (ret);
  }

getTypeIDUnsubscribe()
  {
  let ret = ProtocolTypeId.typeidUnsubscribe;
  return (ret);
  }

getTypeIDPost()
  {
  let ret = ProtocolTypeId.typeidPost;
  return (ret);
  }

getTypeIDPut()
  {
  let ret = ProtocolTypeId.typeidPut;
  return (ret);
  }

getTypeIDBlock()
  {
  let ret = ProtocolTypeId.typeidBlock;
  return (ret);
  }

isError(msg)
  {
  let bRet = (msg[ProtocolTypeId.typeIdIdent] === this.getTypeIDError());
  return (bRet);
  }

isReturn(msg)
  {
  let bRet = (msg[Protocol['V2_0'].typeIdIdent] === this.getTypeIDReturn());
  return (bRet);
  }

isValue(msg)
  {
  let bRet = (msg[Protocol['V2_0'].typeIdIdent] === this.getTypeIDValue());
  return (bRet);
  }

isUpdate(msg)
  {
  let bRet = (msg[Protocol['V2_0'].typeIdIdent] === this.getTypeIDUpdate());
  return (bRet);
  }

isBlock(msg)
  {
  let bRet = (msg[Protocol['V2_0'].typeIdIdent] === this.getTypeIDBlock());
  return (bRet);
  }

}

/**
 * @class MalcolmDefs
 * @description Static enumerations protected in a MalcolmDefs namespace.
 * @author Ian Gillingham
 *
 */
export class MalcolmDefs {
static get MINT32()
  {
  return ("int32");
  }

static get MBOOL()
  {
  return ("bool");
  }
}

let malcolmProtocol = new MalcolmProtocol();

export default malcolmProtocol;
