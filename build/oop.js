(function() {
  var extend, isPlainObject,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    hasProp = {}.hasOwnProperty;

  Function.prototype.include = function(Concern) {
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

  Function.prototype.implement = function(Interface) {
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

  Function.prototype["implements"] = function(Interface) {
    return !!(this._implemenedInterfaces && indexOf.call(this._implemenedInterfaces, Interface) >= 0);
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

}).call(this);
