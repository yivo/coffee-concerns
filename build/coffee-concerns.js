(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    hasProp = {}.hasOwnProperty;

  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      return define(['lodash'], factory);
    } else if (typeof exports === 'object' && typeof module === 'object') {
      return module.exports = factory(require('lodash'));
    } else {
      return factory(root._);
    }
  })(this, function(_) {
    var arrayPush, bothArrays, bothFunctions, bothPlainObjects, clone, extend, hasOwnProp, include, includes, isArray, isFunction, isPlainObject, reopen, tabooMembers;
    include = function(Concern) {
      var ClassMembers, InstanceMembers, _class, _proto, _super, copy, hasConcerns, hasOwnConcerns, included, nextVal, prevVal, prop;
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
      if (!hasConcerns || !hasOwnConcerns) {
        if (this.__super__) {
          copy = extend({}, this.__super__);
          copy.constructor = this.__super__.constructor;
          this.__super__ = copy;
        } else {
          this.__super__ = {};
        }
      }
      ClassMembers = Concern.ClassMembers;
      InstanceMembers = Concern.InstanceMembers || Concern;
      _class = this;
      _super = this.__super__;
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
        if (bothFunctions(prevVal, nextVal)) {
          _super[prop] = _proto[prop] = nextVal;
        } else {
          if (bothPlainObjects(prevVal, nextVal)) {
            nextVal = extend({}, prevVal, nextVal);
          } else if (bothArrays(prevVal, nextVal)) {
            nextVal = [].concat(prevVal, nextVal);
          }
          _super[prop] = prevVal;
          _proto[prop] = nextVal;
        }
      }
      this.concerns.push(Concern);
      if (included = Concern.included) {
        included.call(Concern, this);
      }
      return this;
    };
    reopen = function(prop, modifier) {
      var isArr, isObj, proto, value;
      proto = this.prototype;
      value = proto[prop];
      isObj = isPlainObject(value);
      isArr = !isObj && isArray(value);
      if (!(isObj || isArr)) {
        return value;
      }
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
            arrayPush.apply(value, modifier);
          }
        }
      }
      return value;
    };
    tabooMembers = ['included', 'ClassMembers'];
    isFunction = _.bind(_.isFunction, _);
    isArray = _.bind(_.isArray, _);
    isPlainObject = _.bind(_.isPlainObject, _);
    extend = _.bind(_.extend, _);
    clone = _.bind(_.clone, _);
    hasOwnProp = {}.hasOwnProperty;
    arrayPush = [].push;
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
    Object.defineProperty(Function.prototype, 'include', {
      value: include
    });
    Object.defineProperty(Function.prototype, 'reopen', {
      value: reopen
    });
    Object.defineProperty(Function.prototype, 'includes', {
      value: includes
    });
  });

}).call(this);
