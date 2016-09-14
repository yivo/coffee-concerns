(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    hasProp = {}.hasOwnProperty,
    extend1 = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function(factory) {
    var root;
    root = typeof self === 'object' && self !== null && self.self === self ? self : typeof global === 'object' && global !== null && global.global === global ? global : void 0;
    if (typeof define === 'function' && typeof define.amd === 'object' && define.amd !== null) {
      define(['yess', 'lodash', 'exports'], function(_) {
        return root.Concerns = factory(root, Object, Error, Function, _);
      });
    } else if (typeof module === 'object' && module !== null && typeof module.exports === 'object' && module.exports !== null) {
      module.exports = factory(root, Object, Error, Function, require('yess'), require('lodash'));
    } else {
      root.Concerns = factory(root, Object, Error, Function, root._);
    }
  })(function(__root__, Object, Error, Function, _) {
    var BaseError, CoffeeConcerns, InvalidClass, InvalidConcern, InvalidInstance, TABOO_MEMBERS, bothArrays, bothObjects, checkClass, checkConcern, checkInstance, copySuper, extend, fn, isArray, isClass, isFunction, isObject, j, len, prefixErrorMessage, property, ref;
    checkInstance = function(instance) {
      if (!isObject(instance)) {
        throw new InvalidInstance(instance);
      }
      return true;
    };
    checkClass = function(Class) {
      if (!isClass(Class)) {
        throw new InvalidClass(Class);
      }
      return true;
    };
    checkConcern = function(Concern) {
      if (!isObject(Concern)) {
        throw new InvalidConcern(Concern);
      }
      return true;
    };
    TABOO_MEMBERS = ['included', 'ClassMembers'];
    if (typeof Object.freeze === "function") {
      Object.freeze(TABOO_MEMBERS);
    }
    isFunction = _.isFunction, isClass = _.isClass, isArray = _.isArray, extend = _.extend, copySuper = _.copySuper;
    isObject = function(obj) {
      return obj !== null && typeof obj === 'object' && !isArray(obj);
    };
    bothObjects = function(obj, other) {
      return !!obj && !!other && isObject(obj) && isObject(other);
    };
    bothArrays = function(obj, other) {
      return !!obj && !!other && isArray(obj) && isArray(other);
    };
    CoffeeConcerns = {
      VERSION: '1.0.7'
    };
    if (Object.defineProperty != null) {
      ref = ['concerns', 'concernsOwner'];
      for (j = 0, len = ref.length; j < len; j++) {
        property = ref[j];
        Object.defineProperty(Function.prototype, property, {
          configurable: false,
          enumerable: false,
          value: void 0,
          writable: true
        });
      }
    }
    CoffeeConcerns.include = function(Class, Concern) {
      var ClassMembers, InstanceMembers, _class, _proto, _super, hasConcerns, hasOwnConcerns, nextval, prevval, prop, ref1;
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
          nextval = ClassMembers[prop];
          prevval = _class[prop];
          _class[prop] = bothObjects(prevval, nextval) ? extend({}, prevval, nextval) : bothArrays(prevval, nextval) ? [].concat(prevval, nextval) : nextval;
        }
      }
      for (prop in InstanceMembers) {
        if (!hasProp.call(InstanceMembers, prop)) continue;
        nextval = InstanceMembers[prop];
        if (!(indexOf.call(TABOO_MEMBERS, prop) < 0)) {
          continue;
        }
        prevval = _proto[prop];
        if (bothObjects(prevval, nextval)) {
          nextval = extend({}, prevval, nextval);
        } else if (bothArrays(prevval, nextval)) {
          nextval = [].concat(prevval, nextval);
        } else {
          prevval = nextval;
        }
        _super[prop] = prevval;
        _proto[prop] = nextval;
      }
      Class.concerns.push(Concern);
      if ((ref1 = Concern.included) != null) {
        ref1.call(Class, Class);
      }
      return Class;
    };
    CoffeeConcerns.includes = function(Class, Concern) {
      return (Class.concerns != null) && indexOf.call(Class.concerns, Concern) >= 0;
    };
    CoffeeConcerns.extend = function(instance, Concern) {
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
    };
    if (Function.include == null) {
      fn = function() {
        var args, i, l;
        l = arguments.length;
        i = -1;
        args = [this];
        while (++i < l) {
          args.push(arguments[i]);
        }
        return CoffeeConcerns.include.apply(CoffeeConcerns, args);
      };
      if (Object.defineProperty != null) {
        Object.defineProperty(Function.prototype, 'include', {
          value: fn
        });
      } else {
        Function.prototype.include = fn;
      }
    }
    prefixErrorMessage = function(msg) {
      return "[CoffeeConcerns] " + msg;
    };
    BaseError = (function(superClass) {
      extend1(BaseError, superClass);

      function BaseError() {
        var ref1;
        BaseError.__super__.constructor.call(this, this.message);
                if ((ref1 = typeof Error.captureStackTrace === "function" ? Error.captureStackTrace(this, this.name) : void 0) != null) {
          ref1;
        } else {
          this.stack = new Error().stack;
        };
      }

      return BaseError;

    })(Error);
    InvalidClass = (function(superClass) {
      extend1(InvalidClass, superClass);

      function InvalidClass(Class) {
        this.name = 'InvalidClass';
        this.message = prefixErrorMessage("Concern can be included only in class (function). Got " + Class);
        InvalidClass.__super__.constructor.apply(this, arguments);
      }

      return InvalidClass;

    })(BaseError);
    InvalidInstance = (function(superClass) {
      extend1(InvalidInstance, superClass);

      function InvalidInstance(instance) {
        this.name = 'InvalidInstance';
        this.message = prefixErrorMessage("Concern can extend only instance (object). Got " + instance);
        InvalidInstance.__super__.constructor.apply(this, arguments);
      }

      return InvalidInstance;

    })(BaseError);
    InvalidConcern = (function(superClass) {
      extend1(InvalidConcern, superClass);

      function InvalidConcern(Concern) {
        this.name = 'InvalidConcern';
        this.message = prefixErrorMessage("Concern must be key-value object. Got " + Concern);
        InvalidConcern.__super__.constructor.apply(this, arguments);
      }

      return InvalidConcern;

    })(BaseError);
    return CoffeeConcerns;
  });

}).call(this);
