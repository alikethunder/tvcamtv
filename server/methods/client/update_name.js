Meteor.methods({
  update_name(name){
    Meteor.users.update({_id: this.userId}, {$set: {'profile.name': name}});
  }
})