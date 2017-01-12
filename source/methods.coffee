CoffeeConcerns = 

  include: (Class, Concern) ->
    checkClass(Class)
    checkConcern(Concern)
    
    return Class if Concern in Class.concerns
  
    # Reference to concern members.
    ClassMembers    = Concern.ClassMembers
    InstanceMembers = Concern.InstanceMembers ? Concern
  
    # Process class members.
    if ClassMembers?
      for own prop, newval of ClassMembers when prop not in TABOO_MEMBERS
        oldval      = Class[prop]
        Class[prop] = newval

    # Process instance members.
    for own prop, newval of InstanceMembers when prop not in TABOO_MEMBERS
      oldval = Class::[prop]

      # Define __super__ if it isn't defined.
      #
      # Presence of __super__ will allow user 
      # to gracefully override methods which concern provides:
      #   Foo = { bar: -> [1] }
      #   class Qux
      #     @include Foo
      #     bar: -> super.concat(2)
      #   new Qux().bar() # Returns [1,2]
      #
      # Technically if __super__ isn't defined 
      # this means class doesn't have parent.
      #
      # __super__ which we define will act as pseudo __super__. 
      # Object.create(null) may be a little safer to do this.
      #
      Class.__super__ ?= Object.create?(null) ? {}
      
      # Make and store a copy of __super__ 
      # so it's modifying will not affect parent class.
      privatizeSuperclass(Class)
          
      # This hack allows to override concern in future:
      #   Foo = { bar: -> [1] } 
      #   class Qux
      #     @include Foo
      #     bar: -> super.concat(2)
      #   class XYZ extends Qux
      #     bar: -> super.concat(3)
      #   new XYZ().bar() # Returns [1,2,3]
      #
      Class.__super__[prop] = newval
      Class::[prop]         = newval
  
    # Class.concerns is just a list of included concerns.
    # Reassign this list every time so parents will not be affected.
    Class.concerns = Class.concerns.concat(Concern)
  
    Concern.included?.call(Class, Class)
  
    Class
  
  includes: (Class, Concern) -> Concern in Class.concerns
  
  extend: (instance, Concern) ->
    checkInstance(instance)
    checkConcern(Concern)
    for own prop, value of Concern.InstanceMembers ? Concern
      instance[prop] = value if prop not in TABOO_MEMBERS
    instance
