const malcolmGetAction = path => ({
  type: 'malcolm:send',
  typeid: 'malcolm:core/Get:1.0',
  path,
});

export { malcolmGetAction };

export default { malcolmGetAction };
