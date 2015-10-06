describe('i18njs', function () {
    'use strict';
    var i18n = require('../dist/i18njs.js');
    var expect = require('expect.js');
    var frLocales, enLocales;

    beforeEach(function () {
        enLocales = {
            'ns': {
                'hello': 'Hello',
                'world': 'World',
                'inEnglish': 'inEnglish',
                'inter': '{{=key}}',
                'eval': '{{for(var i = 0; i < 3; i += 1) {}}eval {{}}}',
                'escape': '{{-escape}}'
            }
        };
        frLocales = {
            'ns': {
                'hello': 'Bonjour',
                'world': 'Monde',
                'enFrançais': 'enFrançais',
                'inter': '{{=key}}',
                'eval': '{{for(var i = 0; i < 3; i += 1) {}}eval {{}}}',
                'escape': '{{-escape}}'
            }
        };

        i18n.add('fr', frLocales);
        i18n.add('en', enLocales);
    });

    it('should add locales to the dictionary', function () {
        expect(i18n.getDico().en.ns.hello).to.eql('Hello');
        expect(i18n.getDico().en.ns.world).to.eql('World');
        expect(i18n.getDico().en.ns.inter).to.eql('{{=key}}');
        expect(i18n.getDico().en.ns.eval)
            .to.eql('{{for(var i = 0; i < 3; i += 1) {}}eval {{}}}');
        expect(i18n.getDico().en.ns.escape).to.eql('{{-escape}}');

        expect(i18n.getDico().fr.ns.hello).to.eql('Bonjour');
        expect(i18n.getDico().fr.ns.world).to.eql('Monde');
        expect(i18n.getDico().fr.ns.inter).to.eql('{{=key}}');
        expect(i18n.getDico().fr.ns.eval)
            .to.eql('{{for(var i = 0; i < 3; i += 1) {}}eval {{}}}');
        expect(i18n.getDico().fr.ns.escape).to.eql('{{-escape}}');
    });

    it('should be in english by default', function () {
        expect(i18n.getCurrentLang()).to.eql('en');
        expect(i18n.get('ns.hello')).to.eql('Hello');
        expect(i18n.get('ns.world')).to.eql('World');
    });

    it('should be able to switch language', function () {
        i18n.setLang('fr');
        expect(i18n.get('ns.hello')).to.eql('Bonjour');
        expect(i18n.get('ns.world')).to.eql('Monde');
    });

    it('should determine the presence of a localized string', function () {
        expect(i18n.has('ns.hello')).to.be.ok();
        expect(i18n.has('ns.world')).to.be.ok();
        expect(i18n.has('ns.enFrançais')).to.be.ok();
        expect(i18n.has('ns.inEnglish', 'en')).to.be.ok();
        expect(i18n.has('ns.inEnglish')).to.not.be.ok();
        expect(i18n.has('ns.enFrançais', 'en')).to.not.be.ok();
        expect(i18n.has('ns.inEnglish', 'fr')).to.not.be.ok();
        expect(i18n.has('en')).to.be.ok();
        expect(i18n.has('nl')).to.not.be.ok();
    });

    it('should list all available languages', function () {
        var langs = i18n.listLangs();
        expect(langs).to.contain('en');
        expect(langs).to.contain('fr');
        expect(langs.length).to.eql(2);
    });

    it('should interpolate data', function () {
        expect(i18n.get('ns.inter', {key: 'value'})).to.eql('value');
    });

    it('should escape characters', function () {
        expect(i18n.get('ns.escape', {escape: '&<>"\'`'}))
            .to.eql('&amp;&lt;&gt;&quot;&#x27;&#x60;');
    });

    it('should evaluate code', function () {
        expect(i18n.get('ns.eval')).to.eql('eval eval eval ');
    });

    it('should default when not found', function () {
        expect(i18n.get('test.on.inexistant.string'))
            .to.eql('test.on.inexistant.string');
    });

    it('should send the object when result is not string', function () {
        expect(i18n.get('ns')).to.eql({
                'hello': 'Bonjour',
                'world': 'Monde',
                'enFrançais': 'enFrançais',
                'inter': '{{=key}}',
                'eval': '{{for(var i = 0; i < 3; i += 1) {}}eval {{}}}',
                'escape': '{{-escape}}'
            });
    });

    it('should have defaults', function () {
        i18n.setDefaults({
            key: 'default'
        });
        expect(i18n.get('ns.inter')).to.eql('default');
        expect(i18n.get('key')).to.eql('default');
    });

    it('should have localized defaults', function () {
        i18n.setDefaults({
            fr: {
                key: 'default_fr'
            },
            en: {
                key: 'default_en'
            }
        });
        i18n.setLang('en');
        expect(i18n.get('ns.inter')).to.eql('default_en');
        expect(i18n.get('key')).to.eql('default_en');
        i18n.setLang('fr');
        expect(i18n.get('ns.inter')).to.eql('default_fr');
        expect(i18n.get('key')).to.eql('default_fr');
    });

    it('should overwrite defaults', function () {
        expect(i18n.get('ns.inter', {key: 'overwrite'})).to.eql('overwrite');
    });
});
