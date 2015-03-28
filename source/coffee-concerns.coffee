include = (Concern) ->
  unless isPlainObject(Concern)
    throw new Error("
      Concern must be plain object.
      You gave: #{Concern}.
      Class you tried to include in: #{@name}
    ")

  hadConcerns   = !!@concerns
  holderChanged = hadConcerns and @concernsHolder isnt @

  return @ if hadConcerns and Concern in @concerns

  if hadConcerns
    if holderChanged
      @concernsHolder = @
      @concerns = [].concat @concerns
  else
    @concerns = []
    @concernsHolder = @

  if not hadConcerns or holderChanged
    if @__super__
      copy = extend({}, @__super__)
      copy.constructor = @__super__.constructor
      @__super__ = copy
    else
      @__super__ = {}

  ClassMembers    = Concern.ClassMembers
  InstanceMembers = Concern.InstanceMembers or Concern

  extend @, ClassMembers if ClassMembers

  _super = @__super__
  _proto = @::

  for own key, value of InstanceMembers when key not in ignoredInstanceMembers
    _super[key] = _proto[key] = value

  @concerns.push Concern

  if included = Concern.included
    included.call Concern, @

  @

includes = (Concern) ->
  !!@concerns and Concern in @concerns

extend = (object, properties) ->
  for own name, value of properties
    object[name] = value
  object

objectTag = typeof {}

ignoredInstanceMembers = ['ClassMembers', 'included']

isPlainObject = (object) ->
  object isnt null and typeof object is objectTag

Object.defineProperty Function::, 'include',  value: include
Object.defineProperty Function::, 'includes', value: includes

return