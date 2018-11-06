let fields = {
  _id: 1,
  'profile.name': 1
};

Meteor.publish('users', function(name){
  let u = Meteor.user();
  let q = {_id: {$nin: u.contacts.contacts, $ne: this.userId, $nin: u.contacts.blocked_users}, 'contacts.blocked_users': {$ne: this.userId}, 'contacts.contacts': {$ne: this.userId}};
  if (name){
    q.$text = {$search: name};
    return Meteor.users.find(q, {fields: fields})
  } else return Meteor.users.find(q, {limit: 20, fields: fields})
});

Meteor.publish('user_self', function(){
  return Meteor.users.find({_id: this.userId})
});