Meteor.methods({
  'deny_add_to_contacts'(_id) {
    if (this.userId) {

      Meteor.users.update({
        _id
      }, {
        $pull: {
          'contacts.outbound_requests': this.userId
        }
      });
      Meteor.users.update({
        _id: this.userId
      }, {
        $pull: {
          'contacts.inbound_requests': _id
        }
      });
    }
  }
});