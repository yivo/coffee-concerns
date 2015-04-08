var slice = [].slice,
  hasProp = {}.hasOwnProperty,
  extend1 = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

require('../build/coffee-concerns.js');

describe('Property when reopened', function() {
  var extend;
  extend = function() {
    var base, i, len, obj, objs, prop, value;
    base = arguments[0], objs = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    for (i = 0, len = objs.length; i < len; i++) {
      obj = objs[i];
      for (prop in obj) {
        if (!hasProp.call(obj, prop)) continue;
        value = obj[prop];
        base[prop] = value;
      }
    }
    return base;
  };
  it('should correctly be extended', function() {
    var Base, DerivedBar, DerivedFoo, previous;
    Base = (function() {
      function Base() {}

      Base.prototype.hash = {
        foo: 1,
        bar: 2
      };

      Base.prototype.array = [1, 2, 3];

      return Base;

    })();
    DerivedFoo = (function(superClass) {
      extend1(DerivedFoo, superClass);

      function DerivedFoo() {
        return DerivedFoo.__super__.constructor.apply(this, arguments);
      }

      DerivedFoo.reopen('hash', function() {
        return this.baz = 3;
      });

      DerivedFoo.reopen('array', [4]);

      return DerivedFoo;

    })(Base);
    DerivedBar = (function(superClass) {
      extend1(DerivedBar, superClass);

      function DerivedBar() {
        return DerivedBar.__super__.constructor.apply(this, arguments);
      }

      DerivedBar.reopen('hash', {
        bar: 42
      });

      DerivedBar.reopen('array', function(array) {
        return array.shift();
      });

      return DerivedBar;

    })(Base);
    expect(Base.prototype.hash).toEqual({
      foo: 1,
      bar: 2
    });
    expect(DerivedFoo.prototype.hash).toEqual(extend({}, Base.prototype.hash, {
      baz: 3
    }));
    expect(DerivedFoo.prototype.array).toEqual([].concat(Base.prototype.array, [4]));
    expect(DerivedBar.prototype.hash).toEqual(extend({}, Base.prototype.hash, {
      bar: 42
    }));
    expect(DerivedBar.prototype.array).toEqual(Base.prototype.array.slice(1));
    expect(DerivedFoo.__super__.hash).toBe(Base.prototype.hash);
    expect(DerivedFoo.__super__.array).toBe(Base.prototype.array);
    expect(DerivedBar.__super__.hash).toBe(Base.prototype.hash);
    expect(DerivedBar.__super__.array).toBe(Base.prototype.array);
    previous = DerivedBar.prototype.hash;
    DerivedBar.reopen('hash', {
      bar: 50
    });
    expect(DerivedBar.prototype.hash).toBe(previous);
    return expect(DerivedBar.prototype.hash).toEqual(extend({}, Base.prototype.hash, {
      bar: 50
    }));
  });
  return it('should set property when it is not defined', function() {
    var Bar, Foo;
    Foo = (function() {
      function Foo() {}

      Foo.reopen('property', [1, 2, 3]);

      return Foo;

    })();
    Bar = (function() {
      function Bar() {}

      Bar.reopen('property', {
        banana: 1
      });

      Bar.reopen('string', 'Hello!');

      return Bar;

    })();
    expect(Foo.prototype.property).toEqual([1, 2, 3]);
    expect(Bar.prototype.property).toEqual({
      banana: 1
    });
    return expect(Bar.prototype.string).toEqual('Hello!');
  });
});
