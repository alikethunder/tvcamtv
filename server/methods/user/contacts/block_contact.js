Meteor.methods({
  'block_contact'(_id) {
    if (this.userId) {

      Meteor.users.update({
        _id
      }, {
        $pull: {
          'contacts.contacts': this.userId,
          'contacts.outbound_requests': this.userId,
          'contacts.inbound_requests': this.userId,
        }
      });
      Meteor.users.update({
        _id: this.userId
      }, {
        $pull: {
          'contacts.contacts': _id,
          'contacts.outbound_requests': _id,
          'contacts.inbound_requests': _id,
        },
        $addToSet: {
          'contacts.blocked_users': _id
        }
      });
    }
  }
});