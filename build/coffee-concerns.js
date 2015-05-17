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
  })(this, function(root, _) {
    var Concerns, bothArrays, bothPlainObjects, clone, copySuper, define, extend, func, hasOwnProp, isArray, isFunction, isPlainObject, nativeSlice, prop, tabooMembers;
    Concerns = {};
    Concerns.include = function(Class, Concern) {
      var ClassMembers, InstanceMembers, _class, _proto, _super, hasConcerns, hasOwnConcerns, included, nextVal, prevVal, prop;
      if (!isPlainObject(Concern)) {
        throw new Error("Concern must be plain object. You gave: " + Concern + ". Class you tried to include in: " + (Class.name || Class));
      }
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
          _class[prop] = bothPlainObjects(prevVal, nextVal) ? extend({}, prevVal, nextVal) : bothArrays(prevVal, nextVal) ? [].concat(prevVal, nextVal) : nextVal;
        }
      }
      for (prop in InstanceMembers) {
        if (!hasProp.call(InstanceMembers, prop)) continue;
        nextVal = InstanceMembers[prop];
        if (!(indexOf.call(tabooMembers, prop) < 0)) {
          continue;
        }
        prevVal = _proto[prop];
        if (bothPlainObjects(prevVal, nextVal)) {
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
    tabooMembers = ['included', 'ClassMembers'];
    hasOwnProp = {}.hasOwnProperty;
    isFunction = _.isFunction, isArray = _.isArray, isPlainObject = _.isPlainObject, extend = _.extend, clone = _.clone, copySuper = _.copySuper;
    bothPlainObjects = function(obj, other) {
      return !!obj && !!other && isPlainObject(obj) && isPlainObject(other);
    };
    bothArrays = function(obj, other) {
      return !!obj && !!other && isArray(obj) && isArray(other);
    };
    Concerns.reopen = function(Class, prop, modifier) {
      var i, isArr, isObj, isSet, j, proto, ref, value;
      proto = Class.prototype;
      value = proto[prop];
      isSet = value != null;
      isObj = isSet && isPlainObject(value);
      isArr = isSet && !isObj && isArray(value);
      if (isSet) {
        copySuper(Class)[prop] = value;
      }
      if (isObj || isArr) {
        if (!hasOwnProp.call(proto, prop)) {
          value = proto[prop] = clone(value);
        }
        if (modifier) {
          if (isFunction(modifier)) {
            modifier.call(value, value);
          } else if (isPlainObject(modifier)) {
            if (isObj) {
              extend(value, modifier);
            } else if (isArr) {
              value.push(value);
            }
          } else if (isArr) {
            if (isArray(modifier)) {
              value.push.apply(value, modifier);
            } else if (arguments.length > 2) {
              for (i = j = 2, ref = arguments.length; 2 <= ref ? j < ref : j > ref; i = 2 <= ref ? ++j : --j) {
                value.push(arguments[i]);
              }
            }
          }
        }
      } else if (modifier) {
        proto[prop] = modifier;
      }
      return value;
    };
    Concerns.reopenArray = function(Class, prop) {
      var base;
      (base = Class.prototype)[prop] || (base[prop] = []);
      return Concerns.reopen.apply(Concerns, arguments);
    };
    Concerns.reopenObject = function(Class, prop) {
      var base;
      (base = Class.prototype)[prop] || (base[prop] = {});
      return Concerns.reopen.apply(Concerns, arguments);
    };
    isFunction = _.isFunction, isArray = _.isArray, isPlainObject = _.isPlainObject, extend = _.extend, clone = _.clone, copySuper = _.copySuper;
    hasOwnProp = {}.hasOwnProperty;
    nativeSlice = _.nativeSlice;
    define = function(prop, func) {
      if (!Function.prototype[prop]) {
        return Object.defineProperty(Function.prototype, prop, {
          value: function() {
            var args;
            args = nativeSlice.call(arguments);
            args.unshift(this);
            return func.apply(null, args);
          }
        });
      }
    };
    for (prop in Concerns) {
      if (!hasProp.call(Concerns, prop)) continue;
      func = Concerns[prop];
      if (prop !== 'extend') {
        define(prop, func);
      }
    }
    return Concerns;
  });

}).call(this);
