(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    hasProp = {}.hasOwnProperty;

  (function(factory) {
    var root;
    root = typeof self === 'object' && self !== null && self.self === self ? self : typeof global === 'object' && global !== null && global.global === global ? global : void 0;
    if (typeof define === 'function' && typeof define.amd === 'object' && define.amd !== null) {
      define(['yess', 'lodash', 'exports'], function(_) {
        return root.Concerns = factory(root, Object, TypeError, Function, _);
      });
    } else if (typeof module === 'object' && module !== null && typeof module.exports === 'object' && module.exports !== null) {
      module.exports = factory(root, Object, TypeError, Function, require('yess'), require('lodash'));
    } else {
      root.Concerns = factory(root, Object, TypeError, Function, root._);
    }
  })(function(__root__, Object, TypeError, Function, _) {
    var CoffeeConcerns, TABOO_MEMBERS, checkClass, checkConcern, checkInstance, defineProperty, isClass, isObject, privatizeSuperclass, ref;
    checkInstance = function(instance) {
      if (!isObject(instance)) {
        throw new TypeError("[CoffeeConcerns] Concern can only extend JavaScript object (given " + instance + ")");
      }
      return true;
    };
    checkClass = function(Class) {
      if (!isClass(Class)) {
        throw new TypeError("[CoffeeConcerns] Concern can only be included in JavaScript class e.g. function (given: " + Class + ")");
      }
      return true;
    };
    checkConcern = function(Concern) {
      if (!isObject(Concern)) {
        throw new TypeError("[CoffeeConcerns] Concern must be JavaScript object (given " + Concern + ")");
      }
      return true;
    };
    TABOO_MEMBERS = [];
    TABOO_MEMBERS.push('constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf');
    TABOO_MEMBERS.push('prototype', '__proto__');
    TABOO_MEMBERS.push('included', 'ClassMembers', 'InstanceMembers', '__super__');
    if (typeof Object.freeze === "function") {
      Object.freeze(TABOO_MEMBERS);
    }
    isClass = _.isClass, isObject = _.isObject, privatizeSuperclass = _.privatizeSuperclass;
    defineProperty = (ref = Object.defineProperty) != null ? ref : function(object, property, descriptor) {
      return object[property] = descriptor.value;
    };
    CoffeeConcerns = {
      include: function(Class, Concern) {
        var ClassMembers, InstanceMembers, newval, oldval, prop, ref1, ref2, ref3;
        checkClass(Class);
        checkConcern(Concern);
        if (indexOf.call(Class.concerns, Concern) >= 0) {
          return Class;
        }
        ClassMembers = Concern.ClassMembers;
        InstanceMembers = (ref1 = Concern.InstanceMembers) != null ? ref1 : Concern;
        if (ClassMembers != null) {
          for (prop in ClassMembers) {
            if (!hasProp.call(ClassMembers, prop)) continue;
            newval = ClassMembers[prop];
            if (!(indexOf.call(TABOO_MEMBERS, prop) < 0)) {
              continue;
            }
            oldval = Class[prop];
            Class[prop] = newval;
          }
        }
        for (prop in InstanceMembers) {
          if (!hasProp.call(InstanceMembers, prop)) continue;
          newval = InstanceMembers[prop];
          if (!(indexOf.call(TABOO_MEMBERS, prop) < 0)) {
            continue;
          }
          oldval = Class.prototype[prop];
          if (Class.__super__ == null) {
            Class.__super__ = (ref2 = typeof Object.create === "function" ? Object.create(null) : void 0) != null ? ref2 : {};
          }
          privatizeSuperclass(Class);
          Class.__super__[prop] = newval;
          Class.prototype[prop] = newval;
        }
        Class.concerns = Class.concerns.concat(Concern);
        if ((ref3 = Concern.included) != null) {
          ref3.call(Class, Class);
        }
        return Class;
      },
      includes: function(Class, Concern) {
        return indexOf.call(Class.concerns, Concern) >= 0;
      },
      extend: function(instance, Concern) {
        var prop, ref1, ref2, value;
        checkInstance(instance);
        checkConcern(Concern);
        ref2 = (ref1 = Concern.InstanceMembers) != null ? ref1 : Concern;
        for (prop in ref2) {
          if (!hasProp.call(ref2, prop)) continue;
          value = ref2[prop];
          if (indexOf.call(TABOO_MEMBERS, prop) < 0) {
            instance[prop] = value;
          }
        }
        return instance;
      }
    };
    defineProperty(Function.prototype, 'include', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: function() {
        var a, i, l;
        l = arguments.length;
        i = -1;
        a = [this];
        while (++i < l) {
          a.push(arguments[i]);
        }
        return CoffeeConcerns.include.apply(CoffeeConcerns, a);
      }
    });
    defineProperty(Function.prototype, 'concerns', {
      configurable: false,
      enumerable: false,
      value: [],
      writable: true
    });
    CoffeeConcerns.VERSION = '1.0.9';
    return CoffeeConcerns;
  });

}).call(this);
