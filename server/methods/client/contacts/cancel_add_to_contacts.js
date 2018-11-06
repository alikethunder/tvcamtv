Meteor.methods({
  'cancel_add_to_contacts'(_id) {
    if (this.userId) {

      Meteor.users.update({
        _id
      }, {
        $pull: {
          'contacts.inbound_requests': this.userId
        }
      });
      Meteor.users.update({
        _id: this.userId
      }, {
        $pull: {
          'contacts.outbound_requests': _id
        }
      });
    }
  }
});