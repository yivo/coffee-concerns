((factory) ->

  # Browser and WebWorker
  root = if typeof self is 'object' and self isnt null and self.self is self
    self

  # Server
  else if typeof global is 'object' and global isnt null and global.global is global
    global

  # AMD
  if typeof define is 'function' and typeof define.amd is 'object' and define.amd isnt null
    define ['yess', 'lodash', 'exports'], (_) ->
      root.Concerns = factory(root, Object, Error, Function, _)

  # CommonJS
  else if typeof module is 'object' and module isnt null and
          typeof module.exports is 'object' and module.exports isnt null
    module.exports = factory(root, Object, Error, Function, require('yess'), require('lodash'))

  # Browser and the rest
  else
    root.Concerns = factory(root, Object, Error, Function, root._)

  # No return value
  return

)((__root__, Object, Error, Function, _) ->
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
  
  CoffeeConcerns = VERSION: '1.0.7'
  
  if Object.defineProperty?
    for property in ['concerns', 'concernsOwner']
      Object.defineProperty Function::, property,
        configurable: no
        enumerable:   no
        value:        undefined
        writable:     yes
  
  CoffeeConcerns.include = (Class, Concern) ->
    checkClass(Class)
    checkConcern(Concern)
  
    # We will keep array of included concerns in class member 'concerns'
    # True if class has at least one concerns included
    hasConcerns    = !!Class.concerns
  
    # True if class did set own copy array of concerns
    # so class ancestors will not access parent class concerns array
    hasOwnConcerns = hasConcerns and Class.concernsOwner is Class
  
    # Do not include concern twice
    return Class if hasConcerns and Concern in Class.concerns
  
    if hasConcerns
      # Set own copy array of concerns if it is necessary
      unless hasOwnConcerns
        Class.concerns      = [].concat(Class.concerns)
        Class.concernsOwner = Class
    else
      # Process initial setup for concerns-friendly class
      Class.concerns      = []
      Class.concernsOwner = Class
  
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
      # 'nextval' - value of this property in concern class members
      # 'prevval' - value of this property in class (current)
      for own prop, nextval of ClassMembers
        prevval = _class[prop]
  
        # Try to merge values. Only values of the same type can be merged
        _class[prop] =
          if bothObjects(prevval, nextval)
            extend({}, prevval, nextval)
  
          else if bothArrays(prevval, nextval)
            [].concat(prevval, nextval)
  
          else nextval
  
    # 'prop'          - property name
    # 'nextval'       - value of this property in concern instance members
    # 'prevval'       - value of this property in class prototype (current)
    # 'TABOO_MEMBERS' - property names which must be not included.
    #                   This refers to 'include' hook and 'ClassMembers' when
    #                   instance members specified at concern root (instead of 'InstanceMembers')
    for own prop, nextval of InstanceMembers when prop not in TABOO_MEMBERS
      prevval = _proto[prop]
  
      # Try to merge values
      if bothObjects(prevval, nextval)
        nextval = extend({}, prevval, nextval)
  
      else if bothArrays(prevval, nextval)
        nextval = [].concat(prevval, nextval)
  
      else
        # This cheat allows you to override concern in future
        prevval = nextval
  
      _super[prop] = prevval
      _proto[prop] = nextval
  
    Class.concerns.push(Concern)
  
    Concern.included?.call(Class, Class)
  
    Class
  
  CoffeeConcerns.includes = (Class, Concern) ->
    Class.concerns? and Concern in Class.concerns
  
  CoffeeConcerns.extend = (instance, Concern) ->
    checkInstance(instance)
    checkConcern(Concern)
    for own prop, value of Concern.InstanceMembers ? Concern
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
      Error.captureStackTrace?(this, @name) ? (@stack = new Error().stack)
  
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