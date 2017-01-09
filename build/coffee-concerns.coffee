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
      root.Concerns = factory(root, Object, TypeError, Function, _)

  # CommonJS
  else if typeof module is 'object' and module isnt null and
          typeof module.exports is 'object' and module.exports isnt null
    module.exports = factory(root, Object, TypeError, Function, require('yess'), require('lodash'))

  # Browser and the rest
  else
    root.Concerns = factory(root, Object, TypeError, Function, root._)

  # No return value
  return

)((__root__, Object, TypeError, Function, _) ->
  checkInstance = (instance) ->
    unless isObject(instance)
      throw new TypeError("[CoffeeConcerns] Concern can only extend JavaScript object (typically instance of something). Got: #{instance}") 
    true
  
  checkClass = (Class) ->
    unless isClass(Class)
      throw new TypeError("[CoffeeConcerns] Concern can only be included in JavaScript class (function). Got: #{Class}") 
    true
  
  checkConcern = (Concern) ->
    unless isObject(Concern)
      throw new TypeError("[CoffeeConcerns] Concern must be JavaScript object. Got: #{Concern}") 
    true
  
  TABOO_MEMBERS = []
  TABOO_MEMBERS.push('constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf')
  TABOO_MEMBERS.push('prototype', '__proto__')
  TABOO_MEMBERS.push('included', 'ClassMembers', 'InstanceMembers', '__super__')
  Object.freeze?(TABOO_MEMBERS)
  
  {isClass, isObject, privatizeSuperclass} = _
  
  defineProperty = Object.defineProperty ? (object, property, descriptor) ->
                                             object[property] = descriptor.value
  
  CoffeeConcerns = 
    VERSION: '1.0.7'
  
    include: (Class, Concern) ->
      checkClass(Class)
      checkConcern(Concern)
      
      return Class if Concern in Class.concerns
    
      # Reference to concern members.
      ClassMembers    = Concern.ClassMembers
      InstanceMembers = Concern.InstanceMembers ? Concern
    
      # Process class members.
      if ClassMembers?
        for own prop, newval of ClassMembers when prop not in TABOO_MEMBERS
          oldval      = Class[prop]
          Class[prop] = newval
  
      # Process instance members.
      for own prop, newval of InstanceMembers when prop not in TABOO_MEMBERS
        oldval = Class::[prop]
  
        # Define __super__ if it isn't defined.
        #
        # Presence of __super__ will allow user 
        # to gracefully override methods which concern provides:
        #   Foo = { bar: -> [1] }
        #   class Qux
        #     @include Foo
        #     bar: -> super.concat(2)
        #   new Qux().bar() # Returns [1,2]
        #
        # Technically if __super__ isn't defined 
        # this means class doesn't have parent.
        #
        # __super__ which we define will act as pseudo __super__. 
        # Object.create(null) may be a little safer to do this.
        #
        Class.__super__ ?= Object.create?(null) ? {}
        
        # Make and store a copy of __super__ 
        # so it's modifying will not affect parent class.
        privatizeSuperclass(Class)
            
        # This hack allows to override concern in future:
        #   Foo = { bar: -> [1] } 
        #   class Qux
        #     @include Foo
        #     bar: -> super.concat(2)
        #   class XYZ extends Qux
        #     bar: -> super.concat(3)
        #   new XYZ().bar() # Returns [1,2,3]
        #
        Class.__super__[prop] = newval
        Class::[prop]         = newval
    
      # Class.concerns is just a list of included concerns.
      # Reassign this list every time so parents will not be affected.
      Class.concerns = Class.concerns.concat(Concern)
    
      Concern.included?.call(Class, Class)
    
      Class
    
    includes: (Class, Concern) -> Concern in Class.concerns
    
    extend: (instance, Concern) ->
      checkInstance(instance)
      checkConcern(Concern)
      for own prop, value of Concern.InstanceMembers ? Concern
        instance[prop] = value if prop not in TABOO_MEMBERS
      instance
  
  
  defineProperty Function::, 'include',
    configurable: no
    enumerable:   no
    writable:     no
    value:        ->
      l = arguments.length
      i = -1
      a = [this]
      a.push(arguments[i]) while ++i < l
      CoffeeConcerns.include(a...)
  
  defineProperty Function::, 'concerns',
    configurable: no
    enumerable:   no
    value:        []
    writable:     yes
  
  CoffeeConcerns
)