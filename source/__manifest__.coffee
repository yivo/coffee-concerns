# %include utils.coffee
# %include methods.coffee

defineProperty Function::, 'include',
  configurable: false
  enumerable:   false
  writable:     false
  value:        ->
    l = arguments.length
    i = -1
    a = [this]
    a.push(arguments[i]) while ++i < l
    CoffeeConcerns.include(a...)

defineProperty Function::, 'concerns',
  configurable: false
  enumerable:   false
  value:        []
  writable:     true

CoffeeConcerns.VERSION = '1.0.10'

CoffeeConcerns
