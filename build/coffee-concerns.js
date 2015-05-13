(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    hasProp = {}.hasOwnProperty;

  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      define(['lodash', 'yess'], function(_) {
        return factory(root, _);
      });
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
      factory(root, require('lodash'), require('yess'));
    } else {
      factory(root, root._);
    }
  })(this, function(root, _) {
    var bothArrays, bothPlainObjects, clone, copySuper, extend, hasOwnProp, include, includes, isArray, isFunction, isPlainObject, prop, ref, reopen, reopenArray, reopenObject, tabooMembers, value;
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
      _proto = this.prototype;
      _super = copySuper(this);
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
      this.concerns.push(Concern);
      if (included = Concern.included) {
        included.call(Concern, this);
      }
      return this;
    };
    reopen = function(prop, modifier) {
      var i, isArr, isObj, isSet, j, proto, ref, value;
      proto = this.prototype;
      value = proto[prop];
      isSet = value != null;
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
    tabooMembers = ['included', 'ClassMembers'];
    hasOwnProp = {}.hasOwnProperty;
    isFunction = _.isFunction, isArray = _.isArray, isPlainObject = _.isPlainObject, extend = _.extend, clone = _.clone, copySuper = _.copySuper;
    bothPlainObjects = function(obj, other) {
      return !!obj && !!other && isPlainObject(obj) && isPlainObject(other);
    };
    bothArrays = function(obj, other) {
      return !!obj && !!other && isArray(obj) && isArray(other);
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
  });

}).call(this);
