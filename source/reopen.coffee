Concerns.reopen = (Class, prop, modifier) ->
  proto = Class::
  value = proto[prop]
  isSet = value?
  isObj = isSet and isPlainObject(value)
  isArr = isSet and !isObj and isArray(value)

  if isSet
    copySuper(Class)[prop] = value

  if isObj or isArr
    unless hasOwnProp.call(proto, prop)
      value = proto[prop] = clone(value)

    if modifier

      # Modify value inside a function
      if isFunction(modifier)
        modifier.call(value, value)

      # Extend value with new properties
      else if isPlainObject(modifier)
        if isObj
          extend(value, modifier)
        else if isArr
          value.push(value)

      # Push new items into value
      else if isArr
        if isArray(modifier)
          value.push.apply(value, modifier)

        else if arguments.length > 2
          for i in [2...arguments.length]
            value.push(arguments[i])

  else if modifier
    proto[prop] = modifier

  value

Concerns.reopenArray = (Class, prop) ->
  Class::[prop] ||= []
  Concerns.reopen arguments...

Concerns.reopenObject = (Class, prop) ->
  Class::[prop] ||= {}
  Concerns.reopen arguments...

{isFunction, isArray, isPlainObject, extend, clone, copySuper} = _
hasOwnProp = {}.hasOwnProperty