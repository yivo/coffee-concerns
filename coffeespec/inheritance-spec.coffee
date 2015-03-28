require '../build/coffee-concerns.js'

describe 'Concern', ->

  Concern =
    ClassMembers: classMember: ->
    InstanceMembers: instanceMember: ->

  it 'should be inherited', ->
    class Base
      @include Concern
    class Derived extends Base

    expect(Derived::instanceMember).toBe Concern.InstanceMembers.instanceMember
    expect(Derived.classMember).toBe Concern.ClassMembers.classMember

  it 'should be present in super', ->
    class Base
      @include Concern
      instanceMember: ->

    expect(Base.__super__.instanceMember).toBe Concern.InstanceMembers.instanceMember
    expect(Base::instanceMember).not.toBe Concern.InstanceMembers.instanceMember
