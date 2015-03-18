### Interface usage
```coffeescript
Resizable = 
  ClassMembers:
    getDefaultDimensions: -> throw 'Resizable.getDefaultDimensions called but not implemented'
    
  InstanceMembers:  
    resize: (dimensions) -> throw 'Resizable::resize has been called but not implemented'
  
class Photo
  @implement Resizable
  
  @getDefaultDimensions: -> # implementation omitted...
  
  resize: (dimensions) -> # implementation omitted...

Photo.implements(Resizable) # => true
  
photo = new Photo()
photo.implements(Resizable) # => true
photo.resize 400, 500 # => ok
```

### Concern usage
```coffeescript
HumanAbilities = 

  speak: (text) -> # implementation omitted...
  
  eat: (food) -> # implementation omitted...
  
  sleep: (hours) -> # implementation omitted...
  
HumanFactoryMethods = 
  ClassMembers:
    createMale: -> # implementation omitted...
    
    createFemale: -> # implementation omitted...
  
class Human
  @include HumanAbilities
  @include HumanFactoryMethods

human = new Human()
human.speak('Hello') # => ok
Human.createMale() # => ok
```
