Router.route('/channels_payment', {
  name: "channels_payment",
  action: function(){
    this.render("channels_payment");
  },
  fastRender: true
});