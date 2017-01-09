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
