### Usage
```coffeescript
HumanAbilities =

  say: (message) -> console.log "Saying '#{message}'"

  eat: (food) -> console.log "Eating #{food}"

  sleep: (hours) -> console.log "Sleeping for #{hours} hour(s)"

HumanFactoryMethods =

  included: (Class) ->
    console.log "HumanFactoryMethods included in #{Class.name}"

  ClassMembers:
    createMaleHuman: -> # ...

    createFemaleHuman: -> # ...

class Human
  @include HumanAbilities
  @include HumanFactoryMethods

human = new Human()
human.say('Hello')      # => Saying 'Hello'
human.eat('banana')     # => Eating banana
Human.createMaleHuman() # => ok
```
