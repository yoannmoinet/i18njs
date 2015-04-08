# i18njs

A simple i18n for Javascript with a templating feature.

[![npm version](https://img.shields.io/npm/v/i18njs.svg?style=flat)](http://badge.fury.io/js/i18njs)
[![bower version](https://img.shields.io/bower/v/i18njs.svg?style=flat)](http://bower.io/search/?q=i18njs)

## Installation

Either

```node

npm install --save i18njs

```

or

```node

bower install --save i18njs

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

// i18n.add(language, [namespace,] locales);
i18n.add('en', 'first_test', en_locales);

```

### Change language

By default, language is set to `en`.

```javascript

i18n.lng = 'fr';

```
### Check for availability

If needed, you can also check for the presence of a specific localized string in a particular language.

You can check only the language too.

 ```javascript
 // i18n.has([key,] lang)
 i18n.has('first_test.hello_world.hello', 'en'); 
 // true

 i18n.has('en');
 // true
 ```

### Get basic localized string

```javascript

// i18n.get(key[, data, options]);
i18n.get('first_test.hello_world.hello');
// Hello

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

You can also change delimeters by passing the third `options` arguments

```javascript

var st = i18n.get('st', data, {
	evaluate: /<%([\s\S]+?)%>/g;
    interpolate: /<%=([\s\S]+?)%>/g;
    escape: /<%-([\s\S]+?)%>/g;
});

```

Will result in `<%=interpolate%>`, `<%evaluate%>` or `<%-escape%>`

