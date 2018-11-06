Router.route('/contacts', {
  name: "contacts",  
  action: function(){
    this.render("contacts");
  },
  //fastRender: true
});