Router.route('/stream/:_id', {
  name: "stream",  
  action: function(){
    this.render("stream");
  },
  fastRender: true
});