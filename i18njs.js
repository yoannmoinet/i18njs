if (typeof exports === 'object' && typeof define !== 'function') {
    var define = function (factory) {
        factory(require, exports, module);
    };
}

define(function (require, exports, module) {
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
        // PRIVATES
        var local_lang = 'en';
        var dico = {};
        var defaults = {};
        var evaluate = /\{\{([\s\S]+?)\}\}/g;
        var interpolate = /\{\{=([\s\S]+?)\}\}/g;
        var escape = /\{\{-([\s\S]+?)\}\}/g;

        this.add = function (lang, ns, locales) {
            var i;

            dico[lang] = dico[lang] || {};

            if (locales === undefined) {
                locales = ns;
                ns = undefined;
                obj = dico[lang];
            } else {
                dico[lang][ns] = dico[lang][ns] || {};
                obj = dico[lang][ns];
            }

            for (i in locales) {
                if (locales.hasOwnProperty(i)) {
                    obj[i] = locales[i];
                }
            }
        };

        this.has = function (key, lang) {
            lang = lang || local_lang;

            var keyToParse = lang + '.' + key;

            // Check for the lang
            if (dico[key]) {
                return true;
            }

            // Check for the key and lang
            return parse(keyToParse, dico) ? true : false;
        };

        this.listLangs = function () {
            var langs = [];

            for (var i in dico) {
                langs.push(i);
            }

            return langs;
        };

        this.getCurrentLang = function () {
            return local_lang;
        };

        this.getDico = function () {
            return dico;
        };

        this.setLang = function (lang) {
            local_lang = lang;
            return local_lang;
        };

        this.setDefaults = function (options) {
            defaults = options || {};
        };

        this.get = function (key, data, options, lang) {
            var lng = lang || local_lang;

            if (lang === undefined) {
                if (typeof data === 'string') {
                    lng = data;
                    data = undefined;
                } else if (typeof options === 'string') {
                    lng = options;
                }
            }

            var obj = parse(lng + '.' + key, dico);

            options = options || {};

            if (typeof obj === 'string') {
                var i;
                var settings = {
                    evaluate: options.evaluate || evaluate,
                    interpolate: options.interpolate || interpolate,
                    escape: options.escape || escape
                };
                var new_datas = {};
                var defs = defaults[local_lang] || defaults;

                for (i in defs) {
                    if (defs.hasOwnProperty(i)) {
                        new_datas[i] = defs[i];
                    }
                }

                for (i in data) {
                    if (data.hasOwnProperty(i)) {
                        new_datas[i] = data[i];
                    }
                }

                obj = template(obj, settings)(new_datas);

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
