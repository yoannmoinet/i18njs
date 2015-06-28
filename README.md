# i18njs

A simple i18n for Javascript with a templating feature.

[![npm version](https://img.shields.io/npm/v/i18njs.svg?style=flat)](http://badge.fury.io/js/i18njs)
[![bower version](https://img.shields.io/bower/v/i18njs.svg?style=flat)](http://bower.io/search/?q=i18njs)
[![travis](https://travis-ci.org/yoannmoinet/i18njs.svg)](https://travis-ci.org/yoannmoinet/i18njs)

## Installation

Either

```node

npm install --save i18njs

```

or

```node

bower install --save i18njs

```

## Test

```node

npm test

```

## Usage

After importing it `var i18n = require('i18njs');`

### Add locales

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
i18n.add('en', 'first_test', en_locales);
i18n.add('fr', 'first_test', fr_locales);

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
 i18n.has('first_test.hello_world.hello', 'en');
 // true

 i18n.has('first_test.hello_world.hello');
 // true

 i18n.has('en');
 // true
 ```

### List available languages

```javascript

i18n.listLangs();
// ['en', 'fr']

```

### Get basic localized string

```javascript

// i18n.get(key[, data, options][, lang]);
i18n.get('first_test.hello_world.hello');
// Hello

i18n.get('first_test.hello_world.hello', 'fr');
// Bonjour

```

### Get templated string

It uses a basic templating engine, the same as [underscore](http://underscorejs.org/#template).

It works in the form of `{{=interpolate}}`, `{{evaluate}}` or `{{-escape}}` :

```javascript

var en_locales = {
	'st': '{{=interpolate}} {{for(var i = 0, max = 1; i < max; i += 1) {}}to{{}}} {{-escape}}'
};

var data = {
	'interpolate': 'Hello',
	'escape': '\'<the>\' `&` "World"'
};

i18n.add('en', en_locales);

var st = i18n.get('st', data);
// "Hello  to  &#x27;&lt;the&gt;&#x27; &#x60;&amp;&#x60; &quot;World&quot;"

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

Will result in `<%=interpolate%>`, `<%evaluate%>` or `<%-escape%>`

### Add default values for templates

If you need to have a special key always replaced by the same value (brand for example),
you can set it as default.

```javascript
var defaults = {
	fr: {
		key: 'default fr'
	},
	en: {
		key: 'default en'
	}
};

i18n.setDefaults(defaults);
i18n.get('ns.inter')
//default en
```

If not needed, you don't have to use localized defaults :

```javascript
var defaults = {
	key: 'My Brand'
};

i18n.setDefaults(defaults);
i18n.get('ns.inter')
//My Brand
```
