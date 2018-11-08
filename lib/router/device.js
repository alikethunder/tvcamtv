Router.route('/device:_id', {
  name: "device",  
  action: function(){
    this.render("device");
  },
  //fastRender: true
});