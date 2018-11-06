Meteor.methods({
  request_add_contact(_id) {
    if (this.userId) {
      let u = Meteor.users.findOne({
        _id
      });
      let me = Meteor.user();

      if (!u.contacts.blocked_users.includes(_id) && !u.contacts.contacts.includes(_id) && !me.contacts.blocked_users.includes(_id) && !me.contacts.contacts.includes(_id)) {
        Meteor.users.update({
          _id
        }, {
          $addToSet: {
            'contacts.inbound_requests': me._id
          }
        });
        Meteor.users.update({
          _id: me._id
        }, {
          $addToSet: {
            'contacts.outbound_requests': _id
          }
        });
      }
    }
  }
});