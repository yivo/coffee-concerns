var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

require('../build/coffee-concerns.js');

describe('Concern', function() {
  var Concern;
  Concern = {
    ClassMembers: {
      classMember: function() {}
    },
    InstanceMembers: {
      instanceMember: function() {}
    }
  };
  it('should be inherited', function() {
    var Base, Derived;
    Base = (function() {
      function Base() {}

      Base.include(Concern);

      return Base;

    })();
    Derived = (function(superClass) {
      extend(Derived, superClass);

      function Derived() {
        return Derived.__super__.constructor.apply(this, arguments);
      }

      return Derived;

    })(Base);
    expect(Derived.prototype.instanceMember).toBe(Concern.InstanceMembers.instanceMember);
    return expect(Derived.classMember).toBe(Concern.ClassMembers.classMember);
  });
  return it('should be present in super', function() {
    var Base;
    Base = (function() {
      function Base() {}

      Base.include(Concern);

      Base.prototype.instanceMember = function() {};

      return Base;

    })();
    expect(Base.__super__.instanceMember).toBe(Concern.InstanceMembers.instanceMember);
    return expect(Base.prototype.instanceMember).not.toBe(Concern.InstanceMembers.instanceMember);
  });
});
