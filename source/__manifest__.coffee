# %include utils.coffee
# %include methods.coffee

defineProperty Function::, 'include',
  configurable: no
  enumerable:   no
  writable:     no
  value:        ->
    l = arguments.length
    i = -1
    a = [this]
    a.push(arguments[i]) while ++i < l
    CoffeeConcerns.include(a...)

defineProperty Function::, 'concerns',
  configurable: no
  enumerable:   no
  value:        []
  writable:     yes

CoffeeConcerns
