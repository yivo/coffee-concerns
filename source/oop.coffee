include = (Concern) ->
  unless isPlainObject(Concern)
    throw "Function::include: Concern must be plain object. You gave #{Concern}"

  ClassMembers = Concern.ClassMembers

  if ClassMembers
    delete Concern.ClassMembers

  InstanceMembers = Concern.InstanceMembers or Concern

  extend @, ClassMembers if ClassMembers
  extend @::, InstanceMembers if InstanceMembers

  @

implement = (Interface) ->
  unless isPlainObject(Interface)
    throw "Function::implement: Interface must be plain object. You gave #{Interface}"

  @include Interface

  @_implemenedInterfaces    ||= []
  @_interfacesImplementedBy ||= @

  if @_interfacesImplementedBy isnt @
    @_interfacesImplementedBy = @
    @_implemenedInterfaces = [].concat @_implemenedInterfaces

  @_implemenedInterfaces.push Interface

  @

_implements = (Interface) ->
  if @prototype
    implemented = @_implemenedInterfaces
  else
    implemented = @constructor._implemenedInterfaces

  !!(implemented and Interface in implemented)

extend = (object, properties) ->
  for own name, value of properties
    object[name] = value
  object

isPlainObject = (object) ->
  object isnt null and typeof object is 'object'

Object.defineProperty Function::, 'include',    value: include
Object.defineProperty Function::, 'implement',  value: implement
Object.defineProperty Object::,   'implements', value: _implements
Object.defineProperty Function::, 'implements', value: _implements