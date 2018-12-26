SSR.compileTemplate('index', Assets.getText('index.html'));

Template.index.helpers({
    t9n(key){
        T9n.setLanguage(this.lang || 'en');
        return T9n.get(key).replace('<br>', '').replace('<i class="material-icons">mood</i>', '')
    },
    lang(){
        return this.lang || 'en'
    }
});