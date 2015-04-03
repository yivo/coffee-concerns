var slice = [].slice,
  hasProp = {}.hasOwnProperty,
  extend1 = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

require('../build/coffee-concerns.js');

describe('Concern when inherited', function() {
  var Concern, extend;
  Concern = {
    method: function() {},
    hash: {
      foo: 1,
      bar: 2,
      baz: 3
    },
    text: 'foo',
    ClassMembers: {
      array: [3]
    }
  };
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
  it('should be correctly inherited', function() {
    var Base, Derived;
    Base = (function() {
      function Base() {}

      Base.include(Concern);

      return Base;

    })();
    Derived = (function(superClass) {
      extend1(Derived, superClass);

      function Derived() {
        return Derived.__super__.constructor.apply(this, arguments);
      }

      return Derived;

    })(Base);
    expect(Derived.prototype.method).toBe(Concern.method);
    expect(Derived.prototype.hash).toBe(Concern.hash);
    expect(Derived.prototype.text).toBe(Concern.text);
    expect(Derived.__super__.method).toBe(Concern.method);
    expect(Derived.__super__.hash).toBe(Concern.hash);
    return expect(Derived.__super__.text).toBe(Concern.text);
  });
  return it('should correctly override', function() {
    var Base, DerivedBar, DerivedFoo;
    Base = (function() {
      function Base() {}

      Base.prototype.method = function() {};

      Base.prototype.hash = {
        qux: 4
      };

      Base.array = [1];

      return Base;

    })();
    DerivedFoo = (function(superClass) {
      extend1(DerivedFoo, superClass);

      function DerivedFoo() {
        return DerivedFoo.__super__.constructor.apply(this, arguments);
      }

      DerivedFoo.include(Concern);

      return DerivedFoo;

    })(Base);
    DerivedBar = (function(superClass) {
      extend1(DerivedBar, superClass);

      function DerivedBar() {
        return DerivedBar.__super__.constructor.apply(this, arguments);
      }

      DerivedBar.array = [2];

      DerivedBar.include(Concern);

      return DerivedBar;

    })(Base);
    expect(DerivedFoo.__super__.method).toBe(Concern.method);
    expect(DerivedFoo.__super__.hash).toBe(Base.prototype.hash);
    expect(DerivedFoo.prototype.hash).toEqual(extend({}, Base.prototype.hash, Concern.hash));
    expect(DerivedBar.__super__.method).toBe(Concern.method);
    expect(DerivedBar.__super__.hash).toBe(Base.prototype.hash);
    expect(DerivedBar.prototype.hash).toEqual(extend({}, Base.prototype.hash, Concern.hash));
    expect(Base.array).toEqual([1]);
    expect(DerivedFoo.array).toEqual([1, 3]);
    return expect(DerivedBar.array).toEqual([2, 3]);
  });
});
