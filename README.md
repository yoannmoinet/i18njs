![logo](./dist/logo.png)
-----

> Simplistic I18N tool for universal/isomorphic Javascript.

[![npm version](https://img.shields.io/npm/v/i18njs.svg?style=flat)](http://badge.fury.io/js/i18njs)
[![bower version](https://img.shields.io/bower/v/i18njs.svg?style=flat)](http://bower.io/search/?q=i18njs)
[![travis](https://travis-ci.org/yoannmoinet/i18njs.svg)](https://travis-ci.org/yoannmoinet/i18njs)

----


## Usage with RequireJS

To use with **[RequireJS](http://requirejs.org)** I'd advise to also use the plugin
[requirejs-i18njs](https://github.com/yoannmoinet/requirejs-i18njs) to be able to precompile the templates
that are in your translation files for your production code.

----

## Usage with Handlebars

You can register your helper simply by using the `.get()` function of i18njs

```javascript
Handlebars.registerHelper('i18n',
    function () {
        return i18njs.get.apply(i18njs, arguments);
    }
);
```

then in your templates :

```javascript
// Arguments after the 'key' are optionals
{{i18n 'key' data options lang}}
```

----

## Installation

Either

```node
npm install --save i18njs
```

or

```node
bower install --save i18njs
```
----

## Usage

Import it the way you want into your project :

```javascript
// CommonJS
var i18njs = require('i18njs');
```

```javascript
// AMD
define(['i18njs'], function (i18njs) {
    // use i18njs
});
```

```html
// Global
<script type="text/javascript" src="./dist/i18njs.min.js"></script>
<script type="text/javascript">
    // use i18njs
</script>
```

### Add locales

Your localized strings are simple json objects.

Namespaces can be as deep as you need.

```javascript

var en_locales = {
    'hello_world': {
        'hello': 'Hello',
        'world': 'World'
    }
};

var fr_locales = {
    'hello_world': {
        'hello': 'Bonjour',
        'world': 'Monde'
    }
};

// i18n.add(language, [namespace,] locales);
i18n.add('en', 'first_level_namespace', en_locales);
i18n.add('fr', 'first_level_namespace', fr_locales);

```

### Change language

By default, language is set to `en`.

```javascript

i18n.setLang('fr');

```

### Get current language

```javascript

i18n.getCurrentLang();

```

### Get dictionary

```javascript

i18n.getDico();

```
### Check for availability

If needed, you can also check for the presence of a specific localized string in a particular language.

You can check only the language too.

 ```javascript
 // i18n.has([key,] lang)
 i18n.has('first_level_namespace.hello_world.hello', 'en');
 // true

 i18n.has('first_level_namespace.hello_world.hello');
 // true

 i18n.has('en');
 // true

  i18n.has('de');
  // false

  i18n.has('hello_world.bye', 'en');
  // false

  i18n.has('test');
  // false
 ```

### List available languages

```javascript

i18n.listLangs();
// ['en', 'fr']

```

### Get basic localized string

```javascript

// i18n.get(key[, data, options][, lang]);
i18n.get('first_level_namespace.hello_world.hello');
// Hello

i18n.get('first_level_namespace.hello_world.hello', 'fr');
// Bonjour

```

### Get templated string

It uses a basic templating engine, the same as [underscore](http://underscorejs.org/#template).

It works in the form of `{{=interpolate}}`, `{{evaluate}}` or `{{-escape}}` :

```javascript
// localized strings
var en_locales = {
    'st': '{{=interpolate}}{{for(var i = 0, max = 5; i < max; i += 1) {}} to{{}}} {{-escape}}'
};

// context used in the templated string
var data = {
    'interpolate': 'Hello',
    'escape': '\'<the>\' `&` "World"'
};

// register the localized string
i18n.add('en', en_locales);

// give it a context with the data object
var st = i18n.get('st', data);
// "Hello  to to to to to &#x27;&lt;the&gt;&#x27; &#x60;&amp;&#x60; &quot;World&quot;"

```

### Change delimiters

You can also change delimiters by passing the third `options` arguments

```javascript

var st = i18n.get('st', data, {
    evaluate: /<%([\s\S]+?)%>/g;
    interpolate: /<%=([\s\S]+?)%>/g;
    escape: /<%-([\s\S]+?)%>/g;
});

```

Will result in these delimiters `<%=interpolate%>`, `<%evaluate%>` or `<%-escape%>`

### Add default values for templates

If you need to have a special key always replaced by the same value (a brand for example),
you can set it as a **default**.

This `key` will be then replaced across your application's localized strings and you
won't need to pass it as a context object to your `.get()`.

```javascript
var fr = {
    welcome: 'Bienvenue sur {{=brand}}'
};

var en = {
    welcome: 'Welcome to {{=brand}}'
};

var defaults = {
    fr: {
        brand: 'Ma Marque'
    },
    en: {
        brand: 'My Brand'
    }
};

i18n.add('fr', fr);
i18n.add('en', en);
i18n.setDefaults(defaults);

i18n.get('welcome');
//Welcome to My Brand
i18n.get('brand');
// My Brand
```

You don't have to use localized defaults if you don't need to :

```javascript
var defaults = {
    brand: 'My Brand'
};

i18n.setDefaults(defaults);
i18n.setLang('fr');

i18n.get('welcome');
//Bienvenue sur My Brand
```

You can also check your defaults :

```javascript
i18n.getDefaults();
//{
//  brand: 'My Brand',
//  fr: {
//      brand: 'Ma Marque'
//  },
//  en: {
//      brand: 'My Brand'
//  }
//}
```
