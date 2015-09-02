(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    hasProp = {}.hasOwnProperty;

  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      define(['lodash', 'yess'], function(_) {
        return root.Concerns = factory(root, _);
      });
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
      module.exports = factory(root, require('lodash'), require('yess'));
    } else {
      root.Concerns = factory(root, root._);
    }
  })(this, function(__root__, _) {
    var Concerns, bothArrays, bothObjects, checkClass, checkConcern, checkObject, clone, copySuper, define, extend, func, hasOwnProp, isArray, isFunction, isObject, prop, tabooMembers;
    Concerns = {};
    Concerns.include = function(Class, Concern) {
      var ClassMembers, InstanceMembers, _class, _proto, _super, hasConcerns, hasOwnConcerns, included, nextVal, prevVal, prop;
      checkClass(Class);
      checkConcern(Concern);
      hasConcerns = !!Class.concerns;
      hasOwnConcerns = hasConcerns && Class.concernsOwner === Class;
      if (hasConcerns && indexOf.call(Class.concerns, Concern) >= 0) {
        return Class;
      }
      if (hasConcerns) {
        if (!hasOwnConcerns) {
          Class.concerns = [].concat(Class.concerns);
          Class.concernsOwner = Class;
        }
      } else {
        Class.concerns = [];
        Class.concernsOwner = Class;
      }
      ClassMembers = Concern.ClassMembers;
      InstanceMembers = Concern.InstanceMembers || Concern;
      _class = Class;
      _proto = Class.prototype;
      _super = copySuper(Class);
      if (ClassMembers) {
        for (prop in ClassMembers) {
          if (!hasProp.call(ClassMembers, prop)) continue;
          nextVal = ClassMembers[prop];
          prevVal = _class[prop];
          _class[prop] = bothObjects(prevVal, nextVal) ? extend({}, prevVal, nextVal) : bothArrays(prevVal, nextVal) ? [].concat(prevVal, nextVal) : nextVal;
        }
      }
      for (prop in InstanceMembers) {
        if (!hasProp.call(InstanceMembers, prop)) continue;
        nextVal = InstanceMembers[prop];
        if (!(indexOf.call(tabooMembers, prop) < 0)) {
          continue;
        }
        prevVal = _proto[prop];
        if (bothObjects(prevVal, nextVal)) {
          nextVal = extend({}, prevVal, nextVal);
        } else if (bothArrays(prevVal, nextVal)) {
          nextVal = [].concat(prevVal, nextVal);
        } else {
          prevVal = nextVal;
        }
        _super[prop] = prevVal;
        _proto[prop] = nextVal;
      }
      Class.concerns.push(Concern);
      if (included = Concern.included) {
        included.call(Concern, Class);
      }
      return Class;
    };
    Concerns.includes = function(Class, Concern) {
      return !!Class.concerns && indexOf.call(Class.concerns, Concern) >= 0;
    };
    Concerns.extend = function(object, Concern) {
      var prop, ref, value;
      checkObject(object);
      checkConcern(Concern);
      ref = Concern.InstanceMembers || Concern;
      for (prop in ref) {
        if (!hasProp.call(ref, prop)) continue;
        value = ref[prop];
        if (indexOf.call(tabooMembers, prop) < 0) {
          object[prop] = value;
        }
      }
      return object;
    };
    checkObject = function(object) {
      if (!isObject(object)) {
        throw new Error("[CoffeeConcerns] Concern can extend only objects. You gave: " + object);
      }
    };
    checkClass = function(Class) {
      if (!isFunction(Class)) {
        throw new Error("[CoffeeConcerns] Concern can be included only in class (function). You gave: " + Class);
      }
    };
    checkConcern = function(Concern) {
      if (!isObject(Concern)) {
        throw new Error("[CoffeeConcerns] Concern must be object. You gave: " + Concern + ".");
      }
    };
    tabooMembers = ['included', 'ClassMembers'];
    hasOwnProp = {}.hasOwnProperty;
    isFunction = _.isFunction, isArray = _.isArray, extend = _.extend, clone = _.clone, copySuper = _.copySuper;
    isObject = function(obj) {
      return obj !== null && typeof obj === 'object' && !isArray(obj);
    };
    bothObjects = function(obj, other) {
      return !!obj && !!other && isObject(obj) && isObject(other);
    };
    bothArrays = function(obj, other) {
      return !!obj && !!other && isArray(obj) && isArray(other);
    };
    define = function(prop, func) {
      var _func;
      if (!Function.prototype[prop]) {
        _func = func;
        return Object.defineProperty(Function.prototype, prop, {
          value: function() {
            var args, i, length;
            length = arguments.length;
            i = -1;
            args = Array(length);
            while (++i < length) {
              args[i] = arguments[i];
            }
            args.unshift(this);
            return _func.apply(null, args);
          }
        });
      }
    };
    for (prop in Concerns) {
      if (!hasProp.call(Concerns, prop)) continue;
      func = Concerns[prop];
      define(prop, func);
    }
    return Concerns;
  });

}).call(this);
