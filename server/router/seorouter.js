import {Translations} from '../collections/Translations'

Translations.find({}, {fields: {_id: 1}}).fetch().map(t=>t._id).forEach(lang=>{
    WebApp.connectHandlers.use(`/${lang}`, (req, res, next)=>{
        res.end(SSR.render('index', {lang}))
    });
});