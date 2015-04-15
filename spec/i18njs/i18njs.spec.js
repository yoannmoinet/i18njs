describe('i18njs', function () {
	var i18n = require('../../i18njs');
	var fr_locales, en_locales;
	beforeEach(function () {
		en_locales = {
			'ns': {
				'hello': 'Hello',
				'world': 'World',
				'inEnglish': 'inEnglish',
				'inter': '{{=key}}',
				'eval': '{{for(var i = 0, max = 3; i < 3; i += 1) {}}eval {{}}}',
				'escape': '{{-escape}}'
			}
		};
		fr_locales = {
			'ns': {
				'hello': 'Bonjour',
				'world': 'Monde',
				'enFrançais': 'enFrançais',
				'inter': '{{=key}}',
				'eval': '{{for(var i = 0, max = 3; i < 3; i += 1) {}}eval {{}}}',
				'escape': '{{-escape}}'
			}
		};

		i18n.add('fr', fr_locales);
		i18n.add('en', en_locales);
	});

	it('should add locales to the dictionary', function () {
		expect(i18n.dico.en.ns.hello).toEqual('Hello');
		expect(i18n.dico.en.ns.world).toEqual('World');
		expect(i18n.dico.en.ns.inter).toEqual('{{=key}}');
		expect(i18n.dico.en.ns.eval).toEqual('{{for(var i = 0, max = 3; i < 3; i += 1) {}}eval {{}}}');
		expect(i18n.dico.en.ns.escape).toEqual('{{-escape}}');

		expect(i18n.dico.fr.ns.hello).toEqual('Bonjour');
		expect(i18n.dico.fr.ns.world).toEqual('Monde');
		expect(i18n.dico.fr.ns.inter).toEqual('{{=key}}');
		expect(i18n.dico.fr.ns.eval).toEqual('{{for(var i = 0, max = 3; i < 3; i += 1) {}}eval {{}}}');
		expect(i18n.dico.fr.ns.escape).toEqual('{{-escape}}');
	});

	it('should be in english by default', function () {
		expect(i18n.lng).toEqual('en');
		expect(i18n.get('ns.hello')).toEqual('Hello');
		expect(i18n.get('ns.world')).toEqual('World');
	});

	it('should be able to switch language', function () {
		i18n.lng = 'fr';
		expect(i18n.get('ns.hello')).toEqual('Bonjour');
		expect(i18n.get('ns.world')).toEqual('Monde');
	});

	it('should determine the presence of a localized string', function () {
		expect(i18n.has('ns.hello')).toBeTruthy();
		expect(i18n.has('ns.world')).toBeTruthy();
		expect(i18n.has('ns.enFrançais')).toBeTruthy();
		expect(i18n.has('ns.inEnglish', 'en')).toBeTruthy();
		expect(i18n.has('ns.inEnglish')).toBeFalsy();
		expect(i18n.has('ns.enFrançais', 'en')).toBeFalsy();
		expect(i18n.has('ns.inEnglish', 'fr')).toBeFalsy();
	});

	it('should interpolate data', function () {
		expect(i18n.get('ns.inter', {key: 'value'})).toEqual('value');
	});

	it('should escape characters', function () {
		expect(i18n.get('ns.escape', {escape: '&<>"\'`'})).toEqual('&amp;&lt;&gt;&quot;&#x27;&#x60;');
	});

	it('should evaluate code', function () {
		expect(i18n.get('ns.eval')).toEqual('eval eval eval ');
	});

	it('should default when not found', function () {
		expect(i18n.get('ns')).toEqual('ns');
		expect(i18n.get('test.on.inexistant.string')).toEqual('test.on.inexistant.string');
	});
});