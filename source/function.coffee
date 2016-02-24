unless Function.include?
  fn = ->
    l       = arguments.length
    i       = -1
    args    = [this]
    args.push(arguments[i]) while ++i < l
    CoffeeConcerns.include(args...)

  if Object.defineProperty?
    Object.defineProperty(Function::, 'include', value: fn)
  else
    Function::include = fn
