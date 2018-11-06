Meteor.methods({
  'accept_add_to_contacts'(_id) {
    if (this.userId) {
      let u = Meteor.users.findOne({
        _id
      });
      let me = Meteor.user();

      if (!u.contacts.blocked_users.includes(_id) && !me.contacts.blocked_users.includes(_id)) {
        Meteor.users.update({
          _id
        }, {
          $addToSet: {
            'contacts.contacts': me._id
          },
          $pull: {
            'contacts.outbound_requests': me._id
          }
        });
        Meteor.users.update({
          _id: me._id
        }, {
          $addToSet: {
            'contacts.contacts': _id
          },
          $pull: {
            'contacts.inbound_requests': _id
          }
        });
      }
    }
  }
});