describe('Concern include API', function() {
  describe('ClassMembers and InstanceMembers', function() {
    return it('should correctly extend target', function() {
      var Class, Concern;
      Concern = {
        included: function(Class) {
          return Class && (Class.hookFired = true);
        },
        ClassMembers: {
          method: function() {}
        },
        InstanceMembers: {
          method: function() {}
        }
      };
      Class = (function() {
        function Class() {}

        Class.include(Concern);

        return Class;

      })();
      expect(Class.method).toBe(Concern.ClassMembers.method);
      expect(Class.prototype.method).toBe(Concern.InstanceMembers.method);
      expect(Class.hookFired).toBe(true);
      return expect(Class.prototype.included).toBeUndefined();
    });
  });
  describe('InstanceMembers', function() {
    return it('should correctly extend target', function() {
      var Class, Concern;
      Concern = {
        included: function(Class) {
          return Class && (Class.hookFired = true);
        },
        InstanceMembers: {
          method: function() {}
        }
      };
      Class = (function() {
        function Class() {}

        Class.include(Concern);

        return Class;

      })();
      expect(Class.prototype.method).toBe(Concern.InstanceMembers.method);
      expect(Class.hookFired).toBe(true);
      return expect(Class.prototype.included).toBeUndefined();
    });
  });
  describe('ClassMembers', function() {
    return it('should correctly extend target', function() {
      var Class, Concern;
      Concern = {
        included: function(Class) {
          return Class && (Class.hookFired = true);
        },
        ClassMembers: {
          method: function() {}
        }
      };
      Class = (function() {
        function Class() {}

        Class.include(Concern);

        return Class;

      })();
      expect(Class.method).toBe(Concern.ClassMembers.method);
      expect(Class.hookFired).toBe(true);
      return expect(Class.prototype.included).toBeUndefined();
    });
  });
  describe('InstanceMembers(root)', function() {
    return it('should correctly extend target', function() {
      var Class, Concern;
      Concern = {
        included: function(Class) {
          return Class && (Class.hookFired = true);
        },
        method: function() {}
      };
      Class = (function() {
        function Class() {}

        Class.include(Concern);

        return Class;

      })();
      expect(Class.prototype.method).toBe(Concern.method);
      expect(Class.hookFired).toBe(true);
      return expect(Class.prototype.included).toBeUndefined();
    });
  });
  return describe('ClassMembers and InstanceMembers(root)', function() {
    return it('should correctly extend target', function() {
      var Class, Concern;
      Concern = {
        included: function(Class) {
          return Class && (Class.hookFired = true);
        },
        ClassMembers: {
          method: function() {}
        },
        method: function() {}
      };
      Class = (function() {
        function Class() {}

        Class.include(Concern);

        return Class;

      })();
      expect(Class.prototype.method).toBe(Concern.method);
      expect(Class.hookFired).toBe(true);
      expect(Class.method).toBe(Concern.ClassMembers.method);
      return expect(Class.prototype.included).toBeUndefined();
    });
  });
});
