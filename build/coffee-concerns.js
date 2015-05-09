(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    hasProp = {}.hasOwnProperty;

  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      define(['lodash'], function(_) {
        return factory(root, _);
      });
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
      factory(root, require('lodash'));
    } else {
      factory(root, root._);
    }
  })(this, function(root, _) {
    var bothArrays, bothFunctions, bothPlainObjects, clone, copySuper, extend, hasOwnProp, include, includes, isArray, isFunction, isPlainObject, prop, push, ref, reopen, reopenArray, reopenObject, tabooMembers, value;
    include = function(Concern) {
      var ClassMembers, InstanceMembers, _class, _proto, _super, hasConcerns, hasOwnConcerns, included, nextVal, prevVal, prop;
      if (!isPlainObject(Concern)) {
        throw new Error("Concern must be plain object. You gave: " + Concern + ". Class you tried to include in: " + (this.name || this));
      }
      hasConcerns = !!this.concerns;
      hasOwnConcerns = hasConcerns && this.concernsOwner === this;
      if (hasConcerns && indexOf.call(this.concerns, Concern) >= 0) {
        return this;
      }
      if (hasConcerns) {
        if (!hasOwnConcerns) {
          this.concerns = [].concat(this.concerns);
          this.concernsOwner = this;
        }
      } else {
        this.concerns = [];
        this.concernsOwner = this;
      }
      ClassMembers = Concern.ClassMembers;
      InstanceMembers = Concern.InstanceMembers || Concern;
      _class = this;
      _super = copySuper(this);
      _proto = this.prototype;
      if (ClassMembers) {
        for (prop in ClassMembers) {
          if (!hasProp.call(ClassMembers, prop)) continue;
          nextVal = ClassMembers[prop];
          prevVal = _class[prop];
          if (bothPlainObjects(prevVal, nextVal)) {
            _class[prop] = extend({}, prevVal, nextVal);
          } else if (bothArrays(prevVal, nextVal)) {
            _class[prop] = [].concat(prevVal, nextVal);
          } else {
            _class[prop] = nextVal;
          }
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
      this.concerns.push(Concern);
      if (included = Concern.included) {
        included.call(Concern, this);
      }
      return this;
    };
    reopen = function(prop, modifier) {
      var isArr, isObj, isSet, proto, value;
      proto = this.prototype;
      value = proto[prop];
      isSet = proto[prop] != null;
      isObj = isSet && isPlainObject(value);
      isArr = isSet && !isObj && isArray(value);
      if (isSet) {
        copySuper(this)[prop] = value;
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
            }
          } else if (isArray(modifier)) {
            if (isArr) {
              push.apply(value, modifier);
            }
          }
        }
      } else if (modifier) {
        proto[prop] = modifier;
      }
      return value;
    };
    reopenArray = function(prop) {
      var base;
      (base = this.prototype)[prop] || (base[prop] = []);
      return this.reopen.apply(this, arguments);
    };
    reopenObject = function(prop) {
      var base;
      (base = this.prototype)[prop] || (base[prop] = {});
      return this.reopen.apply(this, arguments);
    };
    copySuper = function(obj) {
      var copy;
      if (obj.superCopier !== obj) {
        if (obj.__super__) {
          copy = extend({}, obj.__super__);
          copy.constructor = obj.__super__.constructor;
          obj.__super__ = copy;
        } else {
          obj.__super__ = {};
        }
        obj.superCopier = obj;
      }
      return obj.__super__;
    };
    tabooMembers = ['included', 'ClassMembers'];
    isFunction = _.isFunction;
    isArray = _.isArray;
    isPlainObject = _.isPlainObject;
    extend = _.extend;
    clone = _.clone;
    hasOwnProp = {}.hasOwnProperty;
    push = [].push;
    bothPlainObjects = function(obj, other) {
      return isPlainObject(obj) && isPlainObject(other);
    };
    bothFunctions = function(obj, other) {
      return isFunction(obj) && isFunction(other);
    };
    bothArrays = function(obj, other) {
      return isArray(obj) && isArray(other);
    };
    includes = function(Concern) {
      return !!this.concerns && indexOf.call(this.concerns, Concern) >= 0;
    };
    ref = {
      include: include,
      includes: includes,
      reopen: reopen,
      reopenArray: reopenArray,
      reopenObject: reopenObject
    };
    for (prop in ref) {
      value = ref[prop];
      if (!Function.prototype[prop]) {
        Object.defineProperty(Function.prototype, prop, {
          value: value
        });
      }
    }
    return;
  });

}).call(this);
