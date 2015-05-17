Concerns = {}

# @include include.coffee
# @include reopen.coffee

{nativeSlice} = _

define = (prop, func) ->
  unless Function::[prop]
    Object.defineProperty Function::, prop, value: ->
      args = nativeSlice.call(arguments)
      args.unshift(this)
      func.apply(null, args)

for own prop, func of Concerns when prop isnt 'extend'
  define(prop, func)

Concerns