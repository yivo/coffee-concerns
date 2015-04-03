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
  return it('should correctly be extended', function() {
    var Base, Derived;
    Base = (function() {
      function Base() {}

      Base.prototype.hash = {
        foo: 1,
        bar: 2
      };

      Base.prototype.array = [1, 2, 3];

      return Base;

    })();
    Derived = (function(superClass) {
      extend1(Derived, superClass);

      function Derived() {
        return Derived.__super__.constructor.apply(this, arguments);
      }

      Derived.reopen('hash', function() {
        return this.baz = 3;
      });

      Derived.reopen('array', [4]);

      return Derived;

    })(Base);
    expect(Base.prototype.hash).toEqual({
      foo: 1,
      bar: 2
    });
    expect(Derived.prototype.hash).toEqual(extend({}, Base.prototype.hash, {
      baz: 3
    }));
    return expect(Derived.prototype.array).toEqual([].concat(Base.prototype.array, [4]));
  });
});
