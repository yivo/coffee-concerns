((factory) ->

  # Browser and WebWorker
  root = if typeof self is 'object' and self?.self is self
    self

  # Server
  else if typeof global is 'object' and global?.global is global
    global

  # AMD
  if typeof define is 'function' and define.amd
    define ['yess', 'lodash', 'exports'], (_) ->
      root.Concerns = factory(root, _)

  # CommonJS
  else if typeof module is 'object' and module isnt null and
          module.exports? and typeof module.exports is 'object'
    module.exports = factory(root, require('yess'), require('lodash'))

  # Browser and the rest
  else
    root.Concerns = factory(root, root._)

  # No return value
  return

)((__root__, _) ->
  checkInstance = (instance) ->
    throw new InvalidInstance(instance) unless isObject(instance)
    true
  
  checkClass = (Class) ->
    throw new InvalidClass(Class) unless isClass(Class)
    true
  
  checkConcern = (Concern) ->
    throw new InvalidConcern(Concern) unless isObject(Concern)
    true
  
  TABOO_MEMBERS = ['included', 'ClassMembers']
  Object.freeze?(TABOO_MEMBERS)
  
  {isFunction, isClass, isArray, extend, copySuper} = _
  
  isObject = (obj) ->
    obj isnt null and typeof obj is 'object' and not isArray(obj)
  
  bothObjects = (obj, other) ->
    !!obj and !!other and isObject(obj) and isObject(other)
  
  bothArrays = (obj, other) ->
    !!obj and !!other and isArray(obj) and isArray(other)
  
  CoffeeConcerns = VERSION: '1.0.4'
  
  CoffeeConcerns.include = (Class, Concern) ->
    checkClass(Class)
    checkConcern(Concern)
  
    # We will keep array of included concerns in class member 'concerns'
    # True if class has at least one concerns included
    hasConcerns    = !!Class.concerns
  
    # True if class did set own copy array of concerns
    # so class ancestors will not access parent class concerns array
    hasOwnConcerns = hasConcerns and Class.concernsOf is Class
  
    # Do not include concern twice
    return Class if hasConcerns and Concern in Class.concerns
  
    if hasConcerns
      # Set own copy array of concerns if it is necessary
      unless hasOwnConcerns
        Class.concerns      = [].concat(Class.concerns)
        Class.concernsOf    = Class
    else
      # Process initial setup for concerns-friendly class
      Class.concerns      = []
      Class.concernsOf    = Class
  
    # Reference to concern members
    ClassMembers    = Concern.ClassMembers
    InstanceMembers = Concern.InstanceMembers or Concern
  
    # Reference to class namespace, for intelligibility
    _class          = Class
  
    # Reference to class prototype, for intelligibility
    _proto          = Class.prototype
  
    # Make and store a copy of class __super__
    # so it's modifying will not affect parent class
    _super          = copySuper(Class)
  
    # Include class members
    if ClassMembers
      # 'prop'    - property name
      # 'nextVal' - value of this property in concern class members
      # 'prevVal' - value of this property in class (current)
      for own prop, nextVal of ClassMembers
        prevVal = _class[prop]
  
        # Try to merge values. Only values of the same type can be merged
        _class[prop] =
          if bothObjects(prevVal, nextVal)
            extend({}, prevVal, nextVal)
  
          else if bothArrays(prevVal, nextVal)
            [].concat(prevVal, nextVal)
  
          else nextVal
  
    # 'prop'          - property name
    # 'nextVal'       - value of this property in concern instance members
    # 'prevVal'       - value of this property in class prototype (current)
    # 'TABOO_MEMBERS' - property names which must be not included.
    #                   This refers to 'include' hook and 'ClassMembers' when
    #                   instance members specified at concern root (instead of 'InstanceMembers')
    for own prop, nextVal of InstanceMembers when prop not in TABOO_MEMBERS
      prevVal = _proto[prop]
  
      # Try to merge values
      if bothObjects(prevVal, nextVal)
        nextVal = extend({}, prevVal, nextVal)
  
      else if bothArrays(prevVal, nextVal)
        nextVal = [].concat(prevVal, nextVal)
  
      else
        # This cheat allows you to override concern in future
        prevVal = nextVal
  
      _super[prop] = prevVal
      _proto[prop] = nextVal
  
    Class.concerns.push(Concern)
  
    if included = Concern.included
      included.call(Class, Class)
    Class
  
  CoffeeConcerns.includes = (Class, Concern) ->
    !!Class.concerns and Concern in Class.concerns
  
  CoffeeConcerns.extend = (instance, Concern) ->
    checkInstance(instance)
    checkConcern(Concern)
    for own prop, value of Concern.InstanceMembers or Concern
      instance[prop] = value if prop not in TABOO_MEMBERS
    instance
  
  unless Function.include?
    fn = ->
      l       = arguments.length
      i       = -1
      args    = [this]
      args.push(arguments[i]) while ++i < l
      CoffeeConcerns.include(args...)
  
    if Object.defineProperty?
      Object.defineProperty(Function::, 'include', value: fn)
    else
      Function::include = fn
  
  prefixErrorMessage = (msg) -> "[CoffeeConcerns] #{msg}"
  
  class BaseError extends Error
    constructor: ->
      super(@message)
      Error.captureStackTrace?(this, @name) or (@stack = new Error().stack)
  
  class InvalidClass extends BaseError
    constructor: (Class) ->
      @name    = 'InvalidClass'
      @message = prefixErrorMessage("Concern can be included only in class (function). Got #{Class}")
      super
  
  class InvalidInstance extends BaseError
    constructor: (instance) ->
      @name    = 'InvalidInstance'
      @message = prefixErrorMessage("Concern can extend only instance (object). Got #{instance}")
      super
  
  class InvalidConcern extends BaseError
    constructor: (Concern) ->
      @name    = 'InvalidConcern'
      @message = prefixErrorMessage("Concern must be key-value object. Got #{Concern}")
      super
  
  CoffeeConcerns
  
)