require '../build/coffee-concerns.js'

describe 'Include API', ->

  it 'should correctly set members. Version: class and instance members', ->
    Concern =
      included: (Class) -> Class and Class.hookFired = yes
      ClassMembers: classMember: ->
      InstanceMembers: instanceMember: ->
    class Class
      @include Concern
    expect(Class.classMember).toBe Concern.ClassMembers.classMember
    expect(Class::instanceMember).toBe Concern.InstanceMembers.instanceMember
    expect(Class::classMember).toBe undefined
    expect(Class.instanceMember).toBe undefined
    expect(Class.hookFired).toBe true

  it 'should correctly set members. Version: instance members', ->
    Concern =
      included: (Class) -> Class and Class.hookFired = yes
      InstanceMembers: instanceMember: ->
    class Class
      @include Concern
    expect(Class::instanceMember).toBe Concern.InstanceMembers.instanceMember
    expect(Class.instanceMember).toBe undefined
    expect(Class.hookFired).toBe true

  it 'should correctly set members. Version: class members', ->
    Concern =
      included: (Class) -> Class and Class.hookFired = yes
      ClassMembers: classMember: ->
    class Class
      @include Concern
    expect(Class.classMember).toBe Concern.ClassMembers.classMember
    expect(Class::classMember).toBe undefined
    expect(Class.hookFired).toBe true

  it 'should correctly set members. Version: instance members in root', ->
    Concern =
      included: (Class) -> Class and Class.hookFired = yes
      instanceMember: ->
    class Class
      @include Concern
    expect(Class::instanceMember).toBe Concern.instanceMember
    expect(Class.instanceMember).toBe undefined
    expect(Class.hookFired).toBe true

  it 'should correctly set members. Version: class members and instance members in root', ->
    Concern =
      included: (Class) -> Class and Class.hookFired = yes
      ClassMembers: classMember: ->
      instanceMember: ->
    class Class
      @include Concern
    expect(Class::instanceMember).toBe Concern.instanceMember
    expect(Class.instanceMember).toBe undefined
    expect(Class.hookFired).toBe true
    expect(Class.classMember).toBe Concern.ClassMembers.classMember
    expect(Class::classMember).toBe undefined