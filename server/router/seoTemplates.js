SSR.compileTemplate('index', Assets.getText('index.html'));

Template.index.helpers({
    t9n(key){
        T9n.setLanguage(this.lang || 'en');
        return T9n.get(key)
    }
});