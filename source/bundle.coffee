((root, factory) ->
  if typeof define is 'function' and define.amd
    define ['lodash'], factory
  else if typeof exports is 'object' && typeof module is 'object'
    module.exports = factory require('lodash')
  else
    factory(root._)
)(@, (_) ->

  # @include coffee-concerns.coffee

)