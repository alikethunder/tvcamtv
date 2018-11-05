let fields = {
  _id: 1,
  'profile.name': 1
};
Meteor.publish('users', function(name){
  
  return name ? Meteor.users.find({$text: {$search: name}}, {fields: fields}) : Meteor.users.find({}, {limit: 20, /*BUG*/fields: fields})
});

Meteor.publish('user_self', function(){
  return Meteor.users.find({_id: this.userId})
});