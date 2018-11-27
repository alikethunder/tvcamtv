Router.route('/', {
  name: "root",
  action: function(){
    this.render("root");
  },
  fastRender: true
});