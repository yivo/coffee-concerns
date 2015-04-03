var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

require('../build/coffee-concerns.js');

describe('Included concerns', function() {
  return it('should be set correctly', function() {
    var Bar, Baz, ConcernBar, ConcernBaz, ConcernFoo, Foo;
    ConcernFoo = {};
    ConcernBar = {};
    ConcernBaz = {};
    Foo = (function() {
      function Foo() {}

      Foo.include(ConcernFoo);

      Foo.include(ConcernBaz);

      return Foo;

    })();
    Bar = (function(superClass) {
      extend(Bar, superClass);

      function Bar() {
        return Bar.__super__.constructor.apply(this, arguments);
      }

      Bar.include(ConcernBaz);

      Bar.include(ConcernBar);

      return Bar;

    })(Foo);
    Baz = (function() {
      function Baz() {}

      Baz.include(ConcernBar);

      Baz.include(ConcernBaz);

      return Baz;

    })();
    expect(Foo.concerns).toEqual([ConcernFoo, ConcernBaz]);
    expect(Bar.concerns).toEqual([ConcernFoo, ConcernBaz, ConcernBar]);
    return expect(Baz.concerns).toEqual([ConcernBar, ConcernBaz]);
  });
});
