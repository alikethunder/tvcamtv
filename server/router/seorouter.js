var seoPicker = Picker.filter(function(req, res) {
    return /_escaped_fragment_/.test(req.url);
});
 
// route for the home page
seoPicker.route('/:lang', function(params, req, res) {
    var posts = Posts.find();
    var html = SSR.render('layout', {
        css: css,
        template: "main",
        data: {posts: posts}
    });
 
    res.end(html);
});