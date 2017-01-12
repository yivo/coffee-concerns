describe 'Concern inclusion API', ->
    
  it 'is defined in function prototype', ->
    expect(typeof (->).include).toBe('function')
  
  it 'works as expected with instance members only (as object)', ->
    Class   = createClass()
    Concern = createConcern(InstanceMembers: method: ->)
    Class.include Concern
    commonExpectations(Class)
    expect(Class::method).toBe(Concern.InstanceMembers.method)

  it 'works as expected with class members only (as object)', ->
    Class   = createClass()
    Concern = createConcern(ClassMembers: method: ->)
    Class.include Concern
    commonExpectations(Class)
    expect(Class.method).toBe(Concern.ClassMembers.method)
    
  it 'works as expected with instance members (as object) and class members (as object)', ->
    Class   = createClass()
    Concern = createConcern(ClassMembers: {classMethod: ->}, InstanceMembers: {instanceMember: ->})
    Class.include Concern
    commonExpectations(Class)
    expect(Class::instanceMember).toBe(Concern.InstanceMembers.instanceMember)
    expect(Class.classMethod).toBe(Concern.ClassMembers.classMethod)

  it 'works as expected with instance members only (at root)', ->
    Class   = createClass()
    Concern = createConcern(method: ->)
    Class.include Concern
    commonExpectations(Class)
    expect(Class::method).toBe(Concern.method)

  it 'works as expected with class members (as object) and instance members (at root)', ->
    Class   = createClass()
    Concern = createConcern(ClassMembers: {classMethod: ->}, instanceMethod: ->)
    Class.include Concern
    commonExpectations(Class)
    expect(Class::instanceMethod).toBe(Concern.instanceMethod)
    expect(Class.classMethod).toBe(Concern.ClassMembers.classMethod)

  it 'throws when trying to include something different than concern', ->
    Class   = createClass()
    Concern = 'something different than concern'
    expect(-> Class.include Concern).toThrowError(TypeError)

  it 'throws when trying to include in something different than class', ->
    Class   = 'something different than class'
    Concern = {}
    expect(-> Concerns.include(Class, Concern)).toThrowError(TypeError)
    
  it 'ignores special properties', ->
    Class   = createClass()
    Concern = createConcern(__super__: {})
    Class.include Concern
    commonExpectations(Class)
    expect('__super__' of Class::).toBe(false)

  createClass = ->
    class Class
      @hooks = 0

  createConcern = (object) ->
    object.included = (Class) -> ++Class.hooks
    object

  commonExpectations = (Class) ->
    expect(Class.hooks).toBe(1)
    for prop in ['included', 'InstanceMembers', 'ClassMembers']
      expect(prop of Class::).toBe(false)
      expect(prop of Class).toBe(false)
