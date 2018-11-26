Meteor.methods({
  update_client_currency(currency){
    Meteor.users.update({_id: this.userId}, {$set: {'profile.currency': currency}});
  }
})