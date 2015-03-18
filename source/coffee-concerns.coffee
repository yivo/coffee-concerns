include = (Concern) ->
  unless isPlainObject(Concern)
    throw "Function::include: Concern must be plain object. You gave #{Concern}"

  ClassMembers    = Concern.ClassMembers
  InstanceMembers = Concern.InstanceMembers
  InstanceMembers ||= omit(Concern, 'ClassMembers', 'included')

  extend @, ClassMembers if ClassMembers
  extend @::, InstanceMembers if InstanceMembers

  @_includedConcerns   ||= []
  @_concernsIncludedIn ||= @

  if @_concernsIncludedIn isnt @
    @_concernsIncludedIn = @
    @_includedConcerns = [].concat @_includedConcerns

  @_includedConcerns.push Concern

  if included = Concern.included
    included.call Concern, @

  @

includes = (Concern) ->
  !!(@_includedConcerns and Concern in @_includedConcerns)

extend = (object, properties) ->
  for own name, value of properties
    object[name] = value
  object

omit = (object, omitted...) ->
  result = {}
  for own key, value of object when key not in omitted
    result[key] = value
  result

isPlainObject = (object) ->
  object isnt null and typeof object is 'object'

Object.defineProperty Function::, 'include',  value: include
Object.defineProperty Function::, 'includes', value: includes

return