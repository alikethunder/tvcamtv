Meteor.methods({
  'unblock_contact'(_id) {
    if (this.userId) {
      Meteor.users.update({
        _id: this.userId
      }, {
        $pull: {
          'contacts.blocked_users': _id
        }
      });
    }
  }
});