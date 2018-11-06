Meteor.methods({
  'remove_contact'(_id) {
    if (this.userId) {

      Meteor.users.update({
        _id
      }, {
        $pull: {
          'contacts.contacts': this.userId
        }
      });
      Meteor.users.update({
        _id: this.userId
      }, {
        $pull: {
          'contacts.contacts': _id
        }
      });
    }
  }
});