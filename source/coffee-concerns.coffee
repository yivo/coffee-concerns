Concerns = {}

Concerns.include = (Class, Concern) ->
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

  # 'prop'         - property name
  # 'nextVal'      - value of this property in concern instance members
  # 'prevVal'      - value of this property in class prototype (current)
  # 'tabooMembers' - property names which must be not included.
  #                  This refers to 'include' hook and 'ClassMembers' when
  #                  instance members specified at concern root (instead of 'InstanceMembers')
  for own prop, nextVal of InstanceMembers when prop not in tabooMembers
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

Concerns.includes = (Class, Concern) ->
  !!Class.concerns and Concern in Class.concerns

Concerns.extend = (object, Concern) ->
  checkObject(object)
  checkConcern(Concern)
  for own prop, value of Concern.InstanceMembers or Concern
    if prop not in tabooMembers
      object[prop] = value
  object

checkObject = (object) ->
  unless isObject(object)
    throw new Error "
      [CoffeeConcerns] Concern can extend only objects.
      You gave: #{object}
    "

checkClass = (Class) ->
  unless isFunction(Class)
    throw new Error "
      [CoffeeConcerns] Concern can be included only in class (function).
      You gave: #{Class}
    "

checkConcern = (Concern) ->
  unless isObject(Concern)
    throw new Error "
      [CoffeeConcerns] Concern must be object.
      You gave: #{Concern}.
    "

tabooMembers  = ['included', 'ClassMembers']
hasOwnProp    = {}.hasOwnProperty
{isFunction, isArray, extend, clone, copySuper} = _

isObject = (obj) ->
  obj isnt null and typeof obj is 'object' and not isArray(obj)

bothObjects = (obj, other) ->
  !!obj and !!other and isObject(obj) and isObject(other)

bothArrays = (obj, other) ->
  !!obj and !!other and isArray(obj) and isArray(other)

Function.include || Object.defineProperty Function::, 'include', value: ->
  length  = arguments.length
  i       = -1
  args    = Array(length)
  args[i] = arguments[i] while ++i < length
  args.unshift(this)
  Concerns.include(args...)

Concerns
