(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    hasProp = {}.hasOwnProperty;

  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      return define(factory);
    } else if (typeof exports !== 'undefined') {
      return module.exports = factory();
    } else {
      return factory();
    }
  })(this, function() {
    var extend, ignoredInstanceMembers, include, includes, isPlainObject, objectTag;
    include = function(Concern) {
      var ClassMembers, InstanceMembers, _proto, _super, copy, hadConcerns, holderChanged, included, key, value;
      if (!isPlainObject(Concern)) {
        throw new Error("Concern must be plain object. You gave: " + Concern + ". Class you tried to include in: " + (this.name || this));
      }
      hadConcerns = !!this.concerns;
      holderChanged = hadConcerns && this.concernsHolder !== this;
      if (hadConcerns && indexOf.call(this.concerns, Concern) >= 0) {
        return this;
      }
      if (hadConcerns) {
        if (holderChanged) {
          this.concernsHolder = this;
          this.concerns = [].concat(this.concerns);
        }
      } else {
        this.concerns = [];
        this.concernsHolder = this;
      }
      if (!hadConcerns || holderChanged) {
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
      if (ClassMembers) {
        extend(this, ClassMembers);
      }
      _super = this.__super__;
      _proto = this.prototype;
      for (key in InstanceMembers) {
        if (!hasProp.call(InstanceMembers, key)) continue;
        value = InstanceMembers[key];
        if (indexOf.call(ignoredInstanceMembers, key) < 0) {
          _super[key] = _proto[key] = value;
        }
      }
      this.concerns.push(Concern);
      if (included = Concern.included) {
        included.call(Concern, this);
      }
      return this;
    };
    includes = function(Concern) {
      return !!this.concerns && indexOf.call(this.concerns, Concern) >= 0;
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
    objectTag = typeof {};
    ignoredInstanceMembers = ['ClassMembers', 'included'];
    isPlainObject = function(object) {
      return object !== null && typeof object === objectTag;
    };
    Object.defineProperty(Function.prototype, 'include', {
      value: include
    });
    Object.defineProperty(Function.prototype, 'includes', {
      value: includes
    });
  });

}).call(this);
