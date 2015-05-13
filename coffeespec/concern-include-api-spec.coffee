describe 'Concern include API', ->
  describe 'ClassMembers and InstanceMembers', ->
    it 'should correctly extend target', ->
      Concern =
        included: (Class) -> Class and Class.hookFired = yes
        ClassMembers: method: ->
        InstanceMembers: method: ->
      class Class
        @include Concern

      expect(Class.method).toBe Concern.ClassMembers.method
      expect(Class::method).toBe Concern.InstanceMembers.method
      expect(Class.hookFired).toBe true
      expect(Class::included).toBeUndefined()

  describe 'InstanceMembers', ->
    it 'should correctly extend target', ->
      Concern =
        included: (Class) -> Class and Class.hookFired = yes
        InstanceMembers: method: ->
      class Class
        @include Concern

      expect(Class::method).toBe Concern.InstanceMembers.method
      expect(Class.hookFired).toBe true
      expect(Class::included).toBeUndefined()

  describe 'ClassMembers', ->
    it 'should correctly extend target', ->
      Concern =
        included: (Class) -> Class and Class.hookFired = yes
        ClassMembers: method: ->
      class Class
        @include Concern
      expect(Class.method).toBe Concern.ClassMembers.method
      expect(Class.hookFired).toBe true
      expect(Class::included).toBeUndefined()

  describe 'InstanceMembers(root)', ->
    it 'should correctly extend target', ->
      Concern =
        included: (Class) -> Class and Class.hookFired = yes
        method: ->
      class Class
        @include Concern
      expect(Class::method).toBe Concern.method
      expect(Class.hookFired).toBe true
      expect(Class::included).toBeUndefined()

  describe 'ClassMembers and InstanceMembers(root)', ->
    it 'should correctly extend target', ->
      Concern =
        included: (Class) -> Class and Class.hookFired = yes
        ClassMembers: method: ->
        method: ->
      class Class
        @include Concern
      expect(Class::method).toBe Concern.method
      expect(Class.hookFired).toBe true
      expect(Class.method).toBe Concern.ClassMembers.method
      expect(Class::included).toBeUndefined()