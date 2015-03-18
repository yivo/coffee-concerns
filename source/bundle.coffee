((root, factory) ->
  if typeof define is 'function' and define.amd
    define factory
  else if typeof exports isnt 'undefined'
    module.exports = factory()
  else
    factory()
)(@, ->

  # @include coffee-concerns.coffee

)