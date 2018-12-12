SSR.compileTemplate('index', Assets.getText('index.html'));
SSR.compileTemplate('oferta', Assets.getText('oferta.html'));

Template.index.helpers({
    t9n(key){
        T9n.setLanguage(this.lang || 'en');
        return T9n.get(key)
    }
});

Template.oferta.helpers({
    t9n(key){
        T9n.setLanguage(this.lang || 'en');
        return T9n.get(key)
    }
});