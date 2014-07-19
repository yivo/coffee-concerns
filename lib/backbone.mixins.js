(function(root, factory) {

    if (typeof define === 'function' && define.amd) {
        define(['backbone', 'underscore'], function(Backbone, _) {
            return factory(Backbone, _);
        });
    } else if (typeof exports !== 'undefined') {
        var Backbone = require('backbone');
        var _ = require('underscore');
        module.exports = factory(Backbone, _);
    } else {
        factory(root.Backbone, root._);
    }

}(this, function(Backbone, _) {
    'use strict';

    var constructorApi = {
    
        use : function() {
            if (!this.__mixins) this.__mixins = [];
    
            _.each(arguments, function(mixin) {
    
                if (!this.using(mixin)) {
                    this.__mixins.push(mixin);
                    _.extend(this.prototype, _.omit(mixin, 'initialize'));
                }
    
            }, this);
    
            return this;
        },
    
        using : function(mixin) {
            var parent = this;
            do {
                if (parent.__mixins && parent.__mixins.indexOf(mixin) !== -1) return true;
            } while (parent.__super__ && (parent = parent.__super__.constructor));
            return false;
        }
    
    };
    
    var prototypeApi = {
    
        use : function() {
            if (!this.__mixins) this.__mixins = [];
    
            _.each(arguments, function(mixin) {
    
                if (!this.using(mixin)) {
                    _.extend(this, _.omit(mixin, 'initialize'));
                    this.__mixins.push(mixin);
                    if (mixin.initialize) {
                        mixin.initialize.call(this);
                    }
                }
    
            }, this);
            return this;
        },
    
        using : function(mixin) {
            return this.constructor.using(mixin)
                || (this.__mixins && this.__mixins.indexOf(mixin) !== -1);
        },
    
        __initializePlugins : function() {
            var mixins = this.constructor.__cachedPlugins;
            if (!this.constructor.__cachedPlugins) {
                var parent = this.constructor;
                var mixin;
                mixins = [];
                do {
                    if (parent.__mixins && parent.__mixins.length) {
                        mixins = mixins.concat(parent.__mixins);
                    }
                } while (parent.__super__ && (parent = parent.__super__.constructor));
                this.constructor.__cachedPlugins = mixins;
            }
            var i = mixins.length;
            while (--i >= 0 && (mixin = mixins[i])) {
                if (mixin.initialize) {
                    mixin.initialize.apply(this, arguments);
                }
            }
            return this;
        }
    
    };
    
    _.each(['Model', 'View', 'Collection', 'Router', 'History'], function(component) {
    
        Backbone[component] = (function(component) {
    
            var constructor = function() {
                this.__initializePlugins.apply(this, arguments);
                return component.apply(this, arguments);
            };
    
            // constructor properties
            _.extend(constructor, component);
    
            // prototype migration
            constructor.prototype = component.prototype;
            constructor.prototype.constructor = constructor;
    
            return constructor;
    
        })(Backbone[component]);
    
        _.extend(Backbone[component], constructorApi);
        _.extend(Backbone[component].prototype, prototypeApi);
    
    });
    
    Backbone.Collection.prototype.model = Backbone.Model;

}));