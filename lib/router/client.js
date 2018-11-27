Router.route('/client', {
  name: "client",  
  action: function(){
    this.render("client");
  },
  fastRender: true
});