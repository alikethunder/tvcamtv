SSR.compileTemplate('index', Assets.getText('index.html'));
Template.index.helpers({
    'seoTitle': function() {
        return "Название сайта (title)";
    },
    'seoDescription': function(){
        return "Супер сеошное описание";
    },
    'seoKeywords': function(){
        return "ключевые слова (если ими ещё кто то пользуется)";
    }
});