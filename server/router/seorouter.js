var seoPicker = Picker.filter(function(req, res) {
    return /_escaped_fragment_/.test(req.url);
});
 
// route for landing
seoPicker.route('/:lang', function(params, req, res) {
    var html = SSR.render('index', {
        data: {lang: params.lang}
    });
 
    res.end(html);
});