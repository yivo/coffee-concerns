(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      return define(factory);
    } else if (typeof exports !== 'undefined') {
      return module.exports = factory();
    } else {
      return factory();
    }
  })(this, function() {
    var extend, include, includes, isPlainObject, omit;
    include = function(Concern) {
      var ClassMembers, InstanceMembers, included;
      if (!isPlainObject(Concern)) {
        throw "Function::include: Concern must be plain object. You gave " + Concern;
      }
      ClassMembers = Concern.ClassMembers;
      InstanceMembers = Concern.InstanceMembers;
      InstanceMembers || (InstanceMembers = omit(Concern, 'ClassMembers', 'included'));
      if (ClassMembers) {
        extend(this, ClassMembers);
      }
      if (InstanceMembers) {
        extend(this.prototype, InstanceMembers);
      }
      this._includedConcerns || (this._includedConcerns = []);
      this._concernsIncludedIn || (this._concernsIncludedIn = this);
      if (this._concernsIncludedIn !== this) {
        this._concernsIncludedIn = this;
        this._includedConcerns = [].concat(this._includedConcerns);
      }
      this._includedConcerns.push(Concern);
      if (included = Concern.included) {
        included.call(Concern, this);
      }
      return this;
    };
    includes = function(Concern) {
      return !!(this._includedConcerns && indexOf.call(this._includedConcerns, Concern) >= 0);
    };
    extend = function(object, properties) {
      var name, value;
      for (name in properties) {
        if (!hasProp.call(properties, name)) continue;
        value = properties[name];
        object[name] = value;
      }
      return object;
    };
    omit = function() {
      var key, object, omitted, result, value;
      object = arguments[0], omitted = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      result = {};
      for (key in object) {
        if (!hasProp.call(object, key)) continue;
        value = object[key];
        if (indexOf.call(omitted, key) < 0) {
          result[key] = value;
        }
      }
      return result;
    };
    isPlainObject = function(object) {
      return object !== null && typeof object === 'object';
    };
    Object.defineProperty(Function.prototype, 'include', {
      value: include
    });
    Object.defineProperty(Function.prototype, 'includes', {
      value: includes
    });
  });

}).call(this);
