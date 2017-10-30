/**
 * Created by Ian Gillingham on 16/09/16.
 */

export const ProtocolTypeId = {
  typeIdIdent      : 'typeid',
  typeidReturn     : 'malcolm:core/Return:1.0',
  typeidValue      : 'malcolm:core/Value:1.0',
  typeidUpdate     : 'malcolm:core/Update:1.0',
  typeidError      : 'malcolm:core/Error:1.0',
  typeidGet        : 'malcolm:core/Get:1.0',
  typeidSubscribe  : 'malcolm:core/Subscribe:1.0',
  typeidUnsubscribe: 'malcolm:core/Unsubscribe:1.0',
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
  let bRet = (msg[ProtocolTypeId.typeIdIdent] === this.getTypeIDReturn());
  return (bRet);
  }

isValue(msg)
  {
  let bRet = (msg[ProtocolTypeId.typeIdIdent] === this.getTypeIDValue());
  return (bRet);
  }

isUpdate(msg)
  {
  let bRet = (msg[ProtocolTypeId.typeIdIdent] === this.getTypeIDUpdate());
  return (bRet);
  }

isBlock(msg)
  {
  let bRet = (msg[ProtocolTypeId.typeIdIdent] === this.getTypeIDBlock());
  return (bRet);
  }

}

let malcolmProtocol = new MalcolmProtocol();

export default malcolmProtocol;
