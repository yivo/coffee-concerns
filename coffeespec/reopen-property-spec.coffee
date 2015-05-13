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
    expect(Base::array).toEqual [1,2,3]

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

  it 'should set property when it is not defined', ->
    class Foo
      @reopen 'property', [1,2,3]

    class Bar
      @reopen 'property', banana: 1
      @reopen 'string', 'Hello!'

    expect(Foo::property).toEqual [1,2,3]
    expect(Bar::property).toEqual banana: 1
    expect(Bar::string).toEqual 'Hello!'

  it 'should correctly save previous value in super', ->
    class Base
      hash: foo: 1

    class Derived1 extends Base
      @reopen 'hash', bar: 2

    class Derived2 extends Derived1
      @reopen 'hash', baz: 3

    class OtherDerived1 extends Base
      @reopen 'hash', qux: 4
      @reopen 'array', []

    class OtherDerived2 extends OtherDerived1
      @reopen 'array', [1]

    expect(Derived1.__super__).not.toBe(Base::)
    expect(Derived2.__super__).not.toBe(Derived1::)
    expect(OtherDerived1.__super__).not.toBe(Base::)
    expect(OtherDerived2.__super__).not.toBe OtherDerived1::

    expect(Derived1.__super__.hash).toBe Base::hash
    expect(OtherDerived1.__super__.hash).toBe Base::hash

    expect(Derived2.__super__.hash).toBe Derived1::hash

    expect(OtherDerived1::array).toEqual []
    expect(OtherDerived2::array).toEqual [1]

  describe 'through reopenArray', ->

    it 'should set empty array when it is not defined', ->
      class Foo
        @reopenArray 'array'

      expect(Foo::array).toEqual []

  describe 'through reopenObject', ->

    it 'should set empty object when it is not defined', ->
      class Foo
        @reopenObject 'object', val: 1

      expect(Foo::object).toEqual val: 1