(function() {
  var _implements, extend, implement, include, isPlainObject,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    hasProp = {}.hasOwnProperty;

  include = function(Concern) {
    var ClassMembers, InstanceMembers;
    if (!isPlainObject(Concern)) {
      throw "Function::include: Concern must be plain object. You gave " + Concern;
    }
    ClassMembers = Concern.ClassMembers;
    if (ClassMembers) {
      delete Concern.ClassMembers;
    }
    InstanceMembers = Concern.InstanceMembers || Concern;
    if (ClassMembers) {
      extend(this, ClassMembers);
    }
    if (InstanceMembers) {
      extend(this.prototype, InstanceMembers);
    }
    return this;
  };

  implement = function(Interface) {
    if (!isPlainObject(Interface)) {
      throw "Function::implement: Interface must be plain object. You gave " + Interface;
    }
    this.include(Interface);
    this._implemenedInterfaces || (this._implemenedInterfaces = []);
    this._interfacesImplementedBy || (this._interfacesImplementedBy = this);
    if (this._interfacesImplementedBy !== this) {
      this._interfacesImplementedBy = this;
      this._implemenedInterfaces = [].concat(this._implemenedInterfaces);
    }
    this._implemenedInterfaces.push(Interface);
    return this;
  };

  _implements = function(Interface) {
    var implemented;
    if (this.prototype) {
      implemented = this._implemenedInterfaces;
    } else {
      implemented = this.constructor._implemenedInterfaces;
    }
    return !!(implemented && indexOf.call(implemented, Interface) >= 0);
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

  isPlainObject = function(object) {
    return object !== null && typeof object === 'object';
  };

  Object.defineProperty(Function.prototype, 'include', {
    value: include
  });

  Object.defineProperty(Function.prototype, 'implement', {
    value: implement
  });

  Object.defineProperty(Object.prototype, 'implements', {
    value: _implements
  });

  Object.defineProperty(Function.prototype, 'implements', {
    value: _implements
  });

}).call(this);
