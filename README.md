# i18njs

A simple i18n for Javascript with a templating feature.

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

By default, language is set to `en`.

```javascript

var en = {
	'hello_world': {
		'hello': 'Hello',
		'world': 'World'
	}
};
// i18n.add(language, namespace [optional], locales);
i18n.add('en', 'first_test', en);

```

### Change language

```javascript

i18n.lng = 'fr';

```

### Get basic localized string

```javascript

// i18n.get(key, data, options);
i18n.get('first_test.hello_world.hello'); // Hello

```

### Get templated string

It uses a basic templating engine, the same as [underscore](http://underscorejs.org/#template).

It works in the form of `{{=interpolate}}`, `{{evaluate}}` or `{{-escape}}` :

```javascript

var en = {
	'st': '{{=interpolate}} {{for(var i = 0, max = 1; i < max; i += 1) {}}to{{}}} {{-escape}}'
};

var data = {
	'interpolate': 'Hello',
	'escape': '\'<the>\' `&` "World"'
};

i18n.add('en', en);
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

