# coffee-concerns
Concern pattern for CoffeeScript

### Defining concern

You must define concern like plain object.
In concern you can specify members which will be mixed into constructor and members which will be mixed into prototype.
There are different ways of specifying them. Check examples below.

```coffeescript
# Lets define concern. The convention for concern name is the same as for classes.
PriceFormats =
  priceWithSign: -> "$#{@price}"

  priceWithCy: -> "#{@price} USD"

# Both `priceWithSign` and `priceWithCy` will be mixed into prototype.

# You can optionally specify class members:
PriceFormats =
  # `priceWithSign` and `priceWithCy` here
  ClassMembers:
    # class members here

# You can strictly specify that members belong to instance:
PriceFormats =
  InstanceMembers:
    # `priceWithSign` and `priceWithCy` here

  ClassMembers:
    # class members here
```
### Hooks
You can specify hook in concern which will be invoked every time concern is included.
```coffeescript
PriceFormats =
  included: (klass) ->
    # do whatever you want

  # `priceWithSign` and `priceWithCy` here
```
### Super members
You can access super members the standard way.
```coffeescript
class IceCream
  @include PriceFormats

  priceWithSign: -> "#{super}/100 grams"

  priceWithCy: -> "#{super} per 100 grams"
```

### Behaviour when including objects or arrays
Objects will be merged, arrays will be concatenated.
```coffeescript
ProductAttributes =
  attributes:
    name: 'string'
    price: 'decimal'

IceCreamAttributes =
  attributes:
    calories: 'int'
    color: 'int'

class Product
  @include ProductAttributes

class IceCream extends Product
  @include IceCreamAttributes

Product::attributes   # => name: 'string', price: 'decimal'
IceCream::attributes  # => name: 'string', price: 'decimal', calories: 'int', color: 'int'
```
### Reopening properties
Sometimes it is necessary to modify object but don't affect parents' object.
See the problem and the solve below.
```coffeescript
# Assume we have this base class
class Base
  obj:
    foo: 1
    bar: 2

class Derived extends base
# We want to add `baz` and remove `foo` from obj

# Manually do this:
  # Copy the object by using lodash or underscore or custom extend
  # and reassign it to own prototype
  @::obj = _.extend({}, @::obj, baz: 3)
  delete @::obj.foo

# Do this by reopening property:
  @reopen 'obj', ->
    @baz = 3
    delete @foo

  # You can find previous value of `obj` in super: Derived.__super__.obj
```
You can reopen objects and array. Reopening other data types will cause nothing.
## Check the complete example
```coffeescript
PriceFormats =
  priceWithSign: -> "$#{@price}"

  priceWithCy: -> "#{@price} USD"

ProductFactory =
  ClassMembers:
    createFromHash: (hash) -> new this(hash)

    createFromJson: (json) -> new this(JSON.parse(json))

ProductAttributes =
  attributes:
    name: 'string'
    price: 'decimal'

  hasAttribute: (name) ->
    !!@attributes[name]

IceCreamAttributes =
  attributes:
    calories: 'int'
    color: 'int'

class Product
  @include ProductAttributes
  @include ProductFactory
  @include PriceFormats

  constructor: (attrs) ->
    for own name, val of attrs when @hasAttribute(name)
      @[name] = val

class Book extends Product
  @reopen 'attributes', author: 'string'

class IceCream extends Product
  @include IceCreamAttributes

  priceWithSign: -> "#{super}/100 grams"

  priceWithCy: -> "#{super} per 100 grams"
```

### Testing
Jasmine was chosen as test framework
Install dependencies
  `npm install`
Run tests
  `npm test`