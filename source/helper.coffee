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
