describe 'Concern inheritance', ->

  Concern =
    instanceMethod: ->
    instanceAttribute: [1,1,1,1]
    ClassMembers: { classMethod: -> }

  it 'works as expected for inherited and overriden members', ->
    fn = [(->), (->), (->), (->)]
    
    class Base
      instanceAttribute: [2,2,2,2]
      instanceMethod: fn[0]
      @classMethod: fn[1]
    class Derived1 extends Base
      @include Concern
      @classMethod: fn[2]
    class Derived2 extends Base
      @include Concern
      instanceAttribute: [0,0,0,0]
      instanceMethod: fn[3]

    # Base
    expect('__super__' of Base).toBe(false)
    
    expect(Base.classMethod).toBe(fn[1])
    
    expect(Base::instanceMethod).toBe(fn[0])
    
    expect(Base::instanceAttribute).toEqual([2,2,2,2])

    # Derived1
    expect(Derived1.__super__?).toBe(true)
    expect(Derived1.__super__).not.toBe(Base.__super__)
    
    expect(Derived1.classMethod).toBe(fn[2])
    
    expect(Derived1::instanceMethod).toBe(Concern.instanceMethod)
    expect(Derived1.__super__.instanceMethod).toBe(Concern.instanceMethod)
    
    expect(Derived1::instanceAttribute).toBe(Concern.instanceAttribute)
    expect(Derived1.__super__.instanceAttribute).toBe(Concern.instanceAttribute)

    # Derived2
    expect(Derived2.__super__?).toBe(true)
    expect(Derived2.__super__).not.toBe(Base.__super__)
    expect(Derived2.__super__).not.toBe(Derived1.__super__)
    
    expect(Derived2.classMethod).toBe(Concern.ClassMembers.classMethod)
    
    expect(Derived2::instanceMethod).toBe(fn[3])
    expect(Derived2.__super__.instanceMethod).toBe(Concern.instanceMethod)
    
    expect(Derived2::instanceAttribute).toEqual([0,0,0,0])
    expect(Derived2.__super__.instanceAttribute).toEqual([1,1,1,1])
