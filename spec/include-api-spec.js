require('../build/coffee-concerns.js');

describe('Include API', function() {
  it('should correctly set members. Version: class and instance members', function() {
    var Class, Concern;
    Concern = {
      included: function(Class) {
        return Class && (Class.hookFired = true);
      },
      ClassMembers: {
        classMember: function() {}
      },
      InstanceMembers: {
        instanceMember: function() {}
      }
    };
    Class = (function() {
      function Class() {}

      Class.include(Concern);

      return Class;

    })();
    expect(Class.classMember).toBe(Concern.ClassMembers.classMember);
    expect(Class.prototype.instanceMember).toBe(Concern.InstanceMembers.instanceMember);
    expect(Class.prototype.classMember).toBe(void 0);
    expect(Class.instanceMember).toBe(void 0);
    return expect(Class.hookFired).toBe(true);
  });
  it('should correctly set members. Version: instance members', function() {
    var Class, Concern;
    Concern = {
      included: function(Class) {
        return Class && (Class.hookFired = true);
      },
      InstanceMembers: {
        instanceMember: function() {}
      }
    };
    Class = (function() {
      function Class() {}

      Class.include(Concern);

      return Class;

    })();
    expect(Class.prototype.instanceMember).toBe(Concern.InstanceMembers.instanceMember);
    expect(Class.instanceMember).toBe(void 0);
    return expect(Class.hookFired).toBe(true);
  });
  it('should correctly set members. Version: class members', function() {
    var Class, Concern;
    Concern = {
      included: function(Class) {
        return Class && (Class.hookFired = true);
      },
      ClassMembers: {
        classMember: function() {}
      }
    };
    Class = (function() {
      function Class() {}

      Class.include(Concern);

      return Class;

    })();
    expect(Class.classMember).toBe(Concern.ClassMembers.classMember);
    expect(Class.prototype.classMember).toBe(void 0);
    return expect(Class.hookFired).toBe(true);
  });
  it('should correctly set members. Version: instance members in root', function() {
    var Class, Concern;
    Concern = {
      included: function(Class) {
        return Class && (Class.hookFired = true);
      },
      instanceMember: function() {}
    };
    Class = (function() {
      function Class() {}

      Class.include(Concern);

      return Class;

    })();
    expect(Class.prototype.instanceMember).toBe(Concern.instanceMember);
    expect(Class.instanceMember).toBe(void 0);
    return expect(Class.hookFired).toBe(true);
  });
  return it('should correctly set members. Version: class members and instance members in root', function() {
    var Class, Concern;
    Concern = {
      included: function(Class) {
        return Class && (Class.hookFired = true);
      },
      ClassMembers: {
        classMember: function() {}
      },
      instanceMember: function() {}
    };
    Class = (function() {
      function Class() {}

      Class.include(Concern);

      return Class;

    })();
    expect(Class.prototype.instanceMember).toBe(Concern.instanceMember);
    expect(Class.instanceMember).toBe(void 0);
    expect(Class.hookFired).toBe(true);
    expect(Class.classMember).toBe(Concern.ClassMembers.classMember);
    return expect(Class.prototype.classMember).toBe(void 0);
  });
});
