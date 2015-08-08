/*globals template*/
var parse = function (key, obj) {
    'use strict';
    var ar = key.split('.');

    while (obj && ar.length) {
        obj = obj[ar.shift()];
    }

    return obj;
};

var I18n = function () {
    'use strict';
    // PRIVATES
    var localLang = 'en';
    var dico = {};
    var defaults = {};
    var evaluate = /\{\{([\s\S]+?)\}\}/g;
    var interpolate = /\{\{=([\s\S]+?)\}\}/g;
    var escape = /\{\{-([\s\S]+?)\}\}/g;

    this.add = function (lang, ns, locales) {
        var i;
        var obj;

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
        lang = lang || localLang;

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
        return localLang;
    };

    this.getDico = function () {
        return dico;
    };

    this.setLang = function (lang) {
        localLang = lang;
        return localLang;
    };

    this.setDefaults = function (options) {
        defaults = options || {};
    };

    this.get = function (key, data, options, lang) {
        var lng = lang || localLang;

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

        if (typeof obj === 'string' || typeof obj === 'function') {
            var i;
            var settings = {
                evaluate: options.evaluate || evaluate,
                interpolate: options.interpolate || interpolate,
                escape: options.escape || escape
            };
            var newDatas = {};
            var defs = defaults[localLang] || defaults;

            for (i in defs) {
                if (defs.hasOwnProperty(i)) {
                    newDatas[i] = defs[i];
                }
            }

            for (i in data) {
                if (data.hasOwnProperty(i)) {
                    newDatas[i] = data[i];
                }
            }

            if (typeof obj !== 'function' && typeof template === 'function') {
                obj = template(obj, settings);
            }

            return obj(newDatas);
        } else if (typeof obj === 'object') {
            return obj;
        }

        return key;
    };
};

return new I18n();
