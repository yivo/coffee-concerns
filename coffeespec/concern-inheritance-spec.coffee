require '../build/coffee-concerns.js'

describe 'Concern when inherited', ->

  Concern =
    method: ->
    hash:
      foo: 1
      bar: 2
      baz: 3
    text: 'foo'

  extend = (base, objs...) ->
    for obj in objs
      base[prop] = value for own prop, value of obj
    base

  it 'should be correctly inherited', ->
    class Base
      @include Concern
    class Derived extends Base

    expect(Derived::method).toBe Concern.method
    expect(Derived::hash).toBe Concern.hash
    expect(Derived::text).toBe Concern.text
    expect(Derived.__super__.method).toBe Concern.method
    expect(Derived.__super__.hash).toBe Concern.hash
    expect(Derived.__super__.text).toBe Concern.text

  it 'should correctly override', ->
    class Base
      method: ->
      hash:
        qux: 4

    class Derived extends Base
      @include Concern

    expect(Derived.__super__.method).toBe Concern.method
    expect(Derived.__super__.hash).toBe Base::hash
    expect(Derived::hash).toEqual extend({}, Base::hash, Concern.hash)