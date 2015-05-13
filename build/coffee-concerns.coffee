((root, factory) ->
  if typeof define is 'function' and define.amd
    define ['lodash', 'yess'], (_) ->
      factory(root, _)
  else if typeof module is 'object' && typeof module.exports is 'object'
    factory(root, require('lodash'), require('yess'))
  else
    factory(root, root._)
  return
)(this, (root, _) ->
  include = (Concern) ->
    unless isPlainObject(Concern)
      throw new Error "
        Concern must be plain object.
        You gave: #{Concern}.
        Class you tried to include in: #{@name or this}
      "
  
    # We will keep array of included concerns in class member 'concerns'
    # True if class has at least one concerns included
    hasConcerns    = !!@concerns
  
    # True if class did set own copy array of concerns
    # so class ancestors will not access parent class concerns array
    hasOwnConcerns = hasConcerns and @concernsOwner is this
  
    # Do not include concern twice
    return this if hasConcerns and Concern in @concerns
  
    if hasConcerns
      # Set own copy array of concerns if it is necessary
      unless hasOwnConcerns
        @concerns      = [].concat(@concerns)
        @concernsOwner = this
    else
      # Process initial setup for concerns-friendly class
      @concerns      = []
      @concernsOwner = this
  
    # Reference to concern members
    ClassMembers    = Concern.ClassMembers
    InstanceMembers = Concern.InstanceMembers or Concern
  
    # Reference to class namespace, for intelligibility
    _class          = this
  
    # Reference to class prototype, for intelligibility
    _proto          = this::
  
    # Make and store a copy of class __super__
    # so it's modifying will not affect parent class
    _super          = copySuper(this)
  
    # Include class members
    if ClassMembers
      # 'prop'    - property name
      # 'nextVal' - value of this property in concern class members
      # 'prevVal' - value of this property in class (current)
      for own prop, nextVal of ClassMembers
        prevVal = _class[prop]
  
        # Try to merge values. Only values of the same type can be merged
        _class[prop] =
          if bothPlainObjects(prevVal, nextVal)
            extend({}, prevVal, nextVal)
  
          else if bothArrays(prevVal, nextVal)
            [].concat(prevVal, nextVal)
  
          else nextVal
  
    # 'prop'         - property name
    # 'nextVal'      - value of this property in concern instance members
    # 'prevVal'      - value of this property in class prototype (current)
    # 'tabooMembers' - property names which must be not included.
    #                  This refers to 'include' hook and 'ClassMembers' when
    #                  instance members specified at concern root (instead of 'InstanceMembers')
    for own prop, nextVal of InstanceMembers when prop not in tabooMembers
      prevVal = _proto[prop]
  
      # Try to merge values
      if bothPlainObjects(prevVal, nextVal)
        nextVal = extend({}, prevVal, nextVal)
  
      else if bothArrays(prevVal, nextVal)
        nextVal = [].concat(prevVal, nextVal)
  
      else
        # This cheat allows you to override concern in future
        prevVal = nextVal
  
      _super[prop] = prevVal
      _proto[prop] = nextVal
  
    @concerns.push(Concern)
  
    if included = Concern.included
      included.call(Concern, this)
    this
  
  reopen = (prop, modifier) ->
    proto = this::
    value = proto[prop]
    isSet = value?
    isObj = isSet and isPlainObject(value)
    isArr = isSet and !isObj and isArray(value)
  
    if isSet
      copySuper(this)[prop] = value
  
    if isObj or isArr
      unless hasOwnProp.call(proto, prop)
        value = proto[prop] = clone(value)
  
      if modifier
  
        # Modify value inside a function
        if isFunction(modifier)
          modifier.call(value, value)
  
        # Extend value with new properties
        else if isPlainObject(modifier)
          if isObj
            extend(value, modifier)
          else if isArr
            value.push(value)
  
        # Push new items into value
        else if isArr
          if isArray(modifier)
            value.push.apply(value, modifier)
  
          else if arguments.length > 2
            for i in [2...arguments.length]
              value.push(arguments[i])
  
    else if modifier
      proto[prop] = modifier
  
    value
  
  reopenArray = (prop) ->
    @::[prop] ||= []
    @reopen arguments...
  
  reopenObject = (prop) ->
    @::[prop] ||= {}
    @reopen arguments...
  
  tabooMembers  = ['included', 'ClassMembers']
  hasOwnProp    = {}.hasOwnProperty
  {isFunction, isArray, isPlainObject, extend, clone, copySuper} = _
  
  bothPlainObjects = (obj, other) ->
    !!obj and !!other and isPlainObject(obj) and isPlainObject(other)
  
  bothArrays = (obj, other) ->
    !!obj and !!other and isArray(obj) and isArray(other)
  
  includes = (Concern) ->
    !!@concerns and Concern in @concerns
  
  for prop, value of {include, includes, reopen, reopenArray, reopenObject} when not Function::[prop]
    Object.defineProperty Function::, prop, {value}
  return
)