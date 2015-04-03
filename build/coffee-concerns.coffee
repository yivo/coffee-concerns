((root, factory) ->
  if typeof define is 'function' and define.amd
    define(['lodash'], factory)
  else if typeof exports is 'object' && typeof module is 'object'
    module.exports = factory(require('lodash'))
  else
    factory(root._)
)(@, (_) ->

  include = (Concern) ->
    unless isPlainObject(Concern)
      throw new Error "
        Concern must be plain object.
        You gave: #{Concern}.
        Class you tried to include in: #{@name or @}
      "
  
    hasConcerns    = !!@concerns
    hasOwnConcerns = hasConcerns and @concernsOwner is @
  
    return @ if hasConcerns and Concern in @concerns
  
    if hasConcerns
      unless hasOwnConcerns
        @concerns = [].concat(@concerns)
        @concernsOwner = @
    else
      @concerns = []
      @concernsOwner = @
  
    if not hasConcerns or not hasOwnConcerns
      if @__super__
        copy = extend({}, @__super__)
        copy.constructor = @__super__.constructor
        @__super__ = copy
      else
        @__super__ = {}
  
    ClassMembers    = Concern.ClassMembers
    InstanceMembers = Concern.InstanceMembers or Concern
    _class = @
    _super = @__super__
    _proto = @::
  
    if ClassMembers
      for own prop, nextVal of ClassMembers
        prevVal = _class[prop]
  
        if bothPlainObjects(prevVal, nextVal)
          _class[prop] = extend({}, prevVal, nextVal)
  
        else if bothArrays(prevVal, nextVal)
          _class[prop] = [].concat(prevVal, nextVal)
  
        else
          _class[prop] = nextVal
  
    for own prop, nextVal of InstanceMembers when prop not in tabooMembers
      prevVal = _proto[prop]
      if bothFunctions(prevVal, nextVal)
        _super[prop] = _proto[prop] = nextVal
  
      else
        if bothPlainObjects(prevVal, nextVal)
          nextVal = extend({}, prevVal, nextVal)
        else if bothArrays(prevVal, nextVal)
          nextVal = [].concat(prevVal, nextVal)
  
        _super[prop] = prevVal
        _proto[prop] = nextVal
  
    @concerns.push(Concern)
  
    if included = Concern.included
      included.call(Concern, @)
  
    @
  
  reopen = (prop, modifier) ->
    proto = @::
    value = proto[prop]
  
    isObj = isPlainObject(value)
    isArr = !isObj and isArray(value)
  
    return value unless isObj or isArr
  
    unless hasOwnProp.call(proto, prop)
      value = proto[prop] = clone(value)
  
    if modifier
      if isFunction(modifier)
        modifier.call(value, value)
  
      else if isPlainObject(modifier)
        extend(value, modifier) if isObj
  
      else if isArray(modifier)
        arrayPush.apply(value, modifier) if isArr
  
    value
  
  tabooMembers  = ['included', 'ClassMembers']
  isFunction    = _.bind(_.isFunction, _)
  isArray       = _.bind(_.isArray, _)
  isPlainObject = _.bind(_.isPlainObject, _)
  extend        = _.bind(_.extend, _)
  clone         = _.bind(_.clone, _)
  hasOwnProp    = {}.hasOwnProperty
  arrayPush     = [].push
  
  bothPlainObjects = (obj, other) ->
    isPlainObject(obj) and isPlainObject(other)
  
  bothFunctions = (obj, other) ->
    isFunction(obj) and isFunction(other)
  
  bothArrays = (obj, other) ->
    isArray(obj) and isArray(other)
  
  includes = (Concern) ->
    !!@concerns and Concern in @concerns
  
  Object.defineProperty Function::, 'include',  value: include
  Object.defineProperty Function::, 'reopen',   value: reopen
  Object.defineProperty Function::, 'includes', value: includes
  
  return
)