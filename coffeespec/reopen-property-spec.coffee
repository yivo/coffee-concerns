require '../build/coffee-concerns.js'

describe 'Property when reopened', ->

  extend = (base, objs...) ->
    for obj in objs
      base[prop] = value for own prop, value of obj
    base

  it 'should correctly be extended', ->
    class Base
      hash:
        foo: 1
        bar: 2
      array: [1,2,3]

    class Derived extends Base
      @reopen 'hash', ->
        @baz = 3

      @reopen 'array', [4]

    expect(Base::hash).toEqual foo: 1, bar:2
    expect(Derived::hash).toEqual extend({}, Base::hash, baz: 3)
    expect(Derived::array).toEqual [].concat(Base::array, [4])
