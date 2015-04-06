if (typeof exports === 'object' && typeof define !== 'function') {
    var define = function (factory) {
        factory(require, exports, module);
    };
}
define(function (require, exports, module) {
    var lng = 'en';
    /*-------------------------------------------*\
    |  TEMPLATE SYSTEM
    |  Based on Underscore's
    |  template system.
    |  https://github.com/jashkenas/underscore/blob/master/underscore.js#L1388
    \*-------------------------------------------*/
    var escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '`': '&#x60;'
    };
    var createEscaper = function(map) {
        var escaper = function(match) {
            return map[match];
        };
        var source = '(?:' + Object.keys(map).join('|') + ')';
        var testRegexp = RegExp(source);
        var replaceRegexp = RegExp(source, 'g');
        return function(string) {
            string = string == null ? '' : '' + string;
            return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
        };
    };
    var noMatch = /(.)^/;
    var escapes = {
        "'":      "'",
        '\\':     '\\',
        '\r':     'r',
        '\n':     'n',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    };
    var escaper = /\\|'|\r|\n|\u2028|\u2029/g;
    var escapeChar = function(match) {
        return '\\' + escapes[match];
    };
    var template = function (text, settings) {
        var matcher = RegExp([
          (settings.escape || noMatch).source,
          (settings.interpolate || noMatch).source,
          (settings.evaluate || noMatch).source
        ].join('|') + '|$', 'g');
        var index = 0;
        var source = "__p+='";
        text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
            source += text.slice(index, offset).replace(escaper, escapeChar);
            index = offset + match.length;
            if (escape) {
                source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
            } else if (interpolate) {
                source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
            } else if (evaluate) {
                source += "';\n" + evaluate + "\n__p+='";
            }
            return match;
        });
        source += "';\n";
        source = 'with(obj){\n' + source + '}\n';
        source = "var __t,__p='',__j=Array.prototype.join," +
            "print=function(){__p+=__j.call(arguments,'');};\n" +
            source + 'return __p;\n';
        try {
            var render = new Function('obj', '_', source);
        } catch (e) {
            e.source = source;
            throw e;
        }
        var template = function (data) {
            return render.call(this, data, {
                escape: createEscaper(escapeMap)
            });
        };
        template.source = 'function(obj){\n' + source + '}';
        return template;
    }
    /*---- END TEMPLATE ----*/
    var I18n = function () {
        this.lng = lng;
        this.string = {};
        this.evaluate = /\{\{([\s\S]+?)\}\}/g;
        this.interpolate = /\{\{=([\s\S]+?)\}\}/g;
        this.escape = /\{\{-([\s\S]+?)\}\}/g;

        this.add = function (lang, ns, locales) {
            var i;
            this.string[lang] = this.string[lang] || {};

            if (locales === undefined) {
                locales = ns;
                ns = undefined;
                obj = this.string[lang];
            } else {
                this.string[lang][ns] = this.string[lang][ns] || {};
                obj = this.string[lang][ns];
            }
            for (i in locales) {
                if (locales.hasOwnProperty(i)) {
                    obj[i] = locales[i];
                }
            }
        };
        this.get = function (key, data, options) {
            var ar = key.split('.');
            var obj = this.string[this.lng];
            options = options || {};
            while (obj && ar.length) {
                obj = obj[ar.shift()];
            }
            if (obj && typeof data === 'object') {
                var settings = {
                    evaluate: options.evaluate || this.evaluate,
                    interpolate: options.interpolate || this.interpolate,
                    escape: options.escape || this.escape
                };
                obj = template(obj, settings)(data);
            }
            return obj || key;
        };
    };
    module.exports = new I18n();
    return module.exports;
});