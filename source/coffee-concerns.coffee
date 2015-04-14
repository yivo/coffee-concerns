include = (Concern) ->
  unless isPlainObject(Concern)
    throw new Error "
      Concern must be plain object.
      You gave: #{Concern}.
      Class you tried to include in: #{@name or @}
    "

  hasConcerns    = !!@concerns
  hasOwnConcerns = hasConcerns and @concernsOwner is @

  return @ if hasConcerns and Concern in @concerns

  if hasConcerns
    unless hasOwnConcerns
      @concerns = [].concat(@concerns)
      @concernsOwner = @
  else
    @concerns = []
    @concernsOwner = @

  ClassMembers    = Concern.ClassMembers
  InstanceMembers = Concern.InstanceMembers or Concern
  _class = @
  _super = copySuper(@)
  _proto = @::

  if ClassMembers
    for own prop, nextVal of ClassMembers
      prevVal = _class[prop]

      if bothPlainObjects(prevVal, nextVal)
        _class[prop] = extend({}, prevVal, nextVal)

      else if bothArrays(prevVal, nextVal)
        _class[prop] = [].concat(prevVal, nextVal)

      else
        _class[prop] = nextVal

  for own prop, nextVal of InstanceMembers when prop not in tabooMembers
    prevVal = _proto[prop]

    if bothPlainObjects(prevVal, nextVal)
      nextVal = extend({}, prevVal, nextVal)

    else if bothArrays(prevVal, nextVal)
      nextVal = [].concat(prevVal, nextVal)

    else
      prevVal = nextVal

    _super[prop] = prevVal
    _proto[prop] = nextVal

  @concerns.push(Concern)

  if included = Concern.included
    included.call(Concern, @)
  @

reopen = (prop, modifier) ->
  proto = @::
  value = proto[prop]
  isSet = proto[prop]?

  isObj = isSet and isPlainObject(value)
  isArr = isSet and !isObj and isArray(value)

  if isSet
    copySuper(@)[prop] = value

  if isObj or isArr
    unless hasOwnProp.call(proto, prop)
      value = proto[prop] = clone(value)

    if modifier
      # Modify value inside a function
      if isFunction(modifier)
        modifier.call(value, value)

      # Extend value with new properties
      else if isPlainObject(modifier)
        extend(value, modifier) if isObj

      # Push new items into value
      else if isArray(modifier)
        push.apply(value, modifier) if isArr

  else if modifier
    proto[prop] = modifier

  value

reopenArray = (prop) ->
  @::[prop] ||= []
  @reopen arguments...

reopenObject = (prop) ->
  @::[prop] ||= {}
  @reopen arguments...

copySuper = (obj) ->
  if obj.superCopier isnt obj
    if obj.__super__
      copy = extend({}, obj.__super__)
      copy.constructor = obj.__super__.constructor
      obj.__super__ = copy
    else
      obj.__super__ = {}
    obj.superCopier = obj
  obj.__super__

tabooMembers  = ['included', 'ClassMembers']
isFunction    = _.isFunction
isArray       = _.isArray
isPlainObject = _.isPlainObject
extend        = _.extend
clone         = _.clone
hasOwnProp    = {}.hasOwnProperty
push          = [].push

bothPlainObjects = (obj, other) ->
  isPlainObject(obj) and isPlainObject(other)

bothFunctions = (obj, other) ->
  isFunction(obj) and isFunction(other)

bothArrays = (obj, other) ->
  isArray(obj) and isArray(other)

includes = (Concern) ->
  !!@concerns and Concern in @concerns

for prop, value of {include, includes, reopen, reopenArray, reopenObject}
  Object.defineProperty Function::, prop, {value}

return