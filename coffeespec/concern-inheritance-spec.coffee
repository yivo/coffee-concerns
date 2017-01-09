describe 'Concern when inherited', ->

  Concern =
    method: ->
    hash: { foo: 1, bar: 2, baz: 3 }
    text: 'foo'
    ClassMembers: { array: [3] }

  it 'should be correctly inherited', ->
    class Base
      @include Concern
      
    class Derived extends Base

    expect(Base.__super__.method).toBe(Concern.method)
    expect(Derived::method).toBe(Concern.method)
    expect(Derived::hash).toBe(Concern.hash)
    expect(Derived::text).toBe(Concern.text)
    expect(Derived.__super__.method).toBe(Concern.method)
    expect(Derived.__super__.hash).toBe(Concern.hash)
    expect(Derived.__super__.text).toBe(Concern.text)

  it 'should correctly override', ->
    class Base
      method: ->
      hash: {qux: 4}
      @array: [1]

    class DerivedFoo extends Base
      @include Concern

    class DerivedBar extends Base
      @array: [2]
      @include Concern

    expect(DerivedFoo.__super__.method).toBe(Concern.method)
    expect(DerivedFoo.__super__.hash).toBe(Concern.hash)
    expect(DerivedFoo::hash).toBe(Concern.hash)

    expect(DerivedBar.__super__.method).toBe(Concern.method)
    expect(DerivedBar.__super__.hash).toBe(Concern.hash)
    expect(DerivedBar::hash).toBe(Concern.hash)

    expect(Base.array).toEqual([1])
    expect(DerivedFoo.array).toEqual([3])
    expect(DerivedBar.array).toEqual([3])
