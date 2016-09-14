prefixErrorMessage = (msg) -> "[CoffeeConcerns] #{msg}"

class BaseError extends Error
  constructor: ->
    super(@message)
    Error.captureStackTrace?(this, @name) ? (@stack = new Error().stack)

class InvalidClass extends BaseError
  constructor: (Class) ->
    @name    = 'InvalidClass'
    @message = prefixErrorMessage("Concern can be included only in class (function). Got #{Class}")
    super

class InvalidInstance extends BaseError
  constructor: (instance) ->
    @name    = 'InvalidInstance'
    @message = prefixErrorMessage("Concern can extend only instance (object). Got #{instance}")
    super

class InvalidConcern extends BaseError
  constructor: (Concern) ->
    @name    = 'InvalidConcern'
    @message = prefixErrorMessage("Concern must be key-value object. Got #{Concern}")
    super
