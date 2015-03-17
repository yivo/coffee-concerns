Function::include = (Concern) ->
  unless isPlainObject(Concern)
    throw "Function::include: Concern must be plain object. You gave #{Concern}"

  ClassMembers = Concern.ClassMembers

  if ClassMembers
    delete Concern.ClassMembers

  InstanceMembers = Concern.InstanceMembers or Concern

  extend @, ClassMembers if ClassMembers
  extend @::, InstanceMembers if InstanceMembers

  @

Function::implement = (Interface) ->
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

Function::implements = (Interface) ->
  !!(@_implemenedInterfaces and Interface in @_implemenedInterfaces)

extend = (object, properties) ->
  for own name, value of properties
    object[name] = value
  object

isPlainObject = (object) ->
  object isnt null and typeof object is 'object'