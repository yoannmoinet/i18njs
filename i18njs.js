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
    var noMatch = /(.)^/;
    var escaper = /\\|'|\r|\n|\u2028|\u2029/g;
    var escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '`': '&#x60;'
    };
    var escapes = {
        "'":      "'",
        '\\':     '\\',
        '\r':     'r',
        '\n':     'n',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
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

    var escapeChar = function(match) {
        return '\\' + escapes[match];
    };

    var template = function (text, settings) {
        var index = 0;
        var source = "__p+='";

        var matcher = RegExp([
          (settings.escape || noMatch).source,
          (settings.interpolate || noMatch).source,
          (settings.evaluate || noMatch).source
        ].join('|') + '|$', 'g');

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
        source = 'with(obj||{}){\n' + source + '}\n';
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
    };
    /*---- END TEMPLATE ----*/

    var parse = function (key, obj) {
        var ar = key.split('.');

        while (obj && ar.length) {
            obj = obj[ar.shift()];
        }

        return obj;
    };

    var I18n = function () {
        this.lng = lng;
        this.dico = {};
        this.evaluate = /\{\{([\s\S]+?)\}\}/g;
        this.interpolate = /\{\{=([\s\S]+?)\}\}/g;
        this.escape = /\{\{-([\s\S]+?)\}\}/g;

        this.add = function (lang, ns, locales) {
            var i;

            this.dico[lang] = this.dico[lang] || {};

            if (locales === undefined) {
                locales = ns;
                ns = undefined;
                obj = this.dico[lang];
            } else {
                this.dico[lang][ns] = this.dico[lang][ns] || {};
                obj = this.dico[lang][ns];
            }

            for (i in locales) {
                if (locales.hasOwnProperty(i)) {
                    obj[i] = locales[i];
                }
            }
        };

        this.has = function (key, lang) {
            lang = lang || this.lng;

            var keyToParse = lang + '.' + key;

            // Check for the lang
            if (this.dico[key]) {
                return true;
            }

            // Check for the key and lang
            return parse(keyToParse, this.dico) ? true : false;
        };

        this.langs = function () {
            var langs = [];

            for (var i in this.dico) {
                langs.push(i);
            }

            return langs;
        };

        this.get = function (key, data, options, lang) {
            var lng = lang || this.lng;

            if (lang === undefined) {
                if (typeof data === 'string') {
                    lng = data;
                    data = undefined;
                } else if (typeof options === 'string') {
                    lng = options;
                }
            }

            var obj = parse(lng + '.' + key, this.dico);

            options = options || {};

            if (typeof obj === 'string') {
                var settings = {
                    evaluate: options.evaluate || this.evaluate,
                    interpolate: options.interpolate || this.interpolate,
                    escape: options.escape || this.escape
                };

                obj = template(obj, settings)(data);

                return obj;
            } else if (typeof obj === 'object') {
                return obj;
            }

            return key;
        };
    };

    module.exports = new I18n();

    return module.exports;
});
