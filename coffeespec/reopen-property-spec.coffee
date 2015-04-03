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

    class DerivedFoo extends Base
      @reopen 'hash', ->
        @baz = 3

      @reopen 'array', [4]

    class DerivedBar extends Base
      @reopen 'hash', bar: 42
      @reopen 'array', (array) ->
        array.shift()

    expect(Base::hash).toEqual foo: 1, bar:2

    expect(DerivedFoo::hash).toEqual extend({}, Base::hash, baz: 3)
    expect(DerivedFoo::array).toEqual [].concat(Base::array, [4])

    expect(DerivedBar::hash).toEqual extend({}, Base::hash, bar: 42)
    expect(DerivedBar::array).toEqual Base::array.slice(1)

    expect(DerivedFoo.__super__.hash).toBe Base::hash
    expect(DerivedFoo.__super__.array).toBe Base::array

    expect(DerivedBar.__super__.hash).toBe Base::hash
    expect(DerivedBar.__super__.array).toBe Base::array

    previous = DerivedBar::hash

    DerivedBar.reopen('hash', bar: 50)

    expect(DerivedBar::hash).toBe previous
    expect(DerivedBar::hash).toEqual extend({}, Base::hash, bar: 50)
