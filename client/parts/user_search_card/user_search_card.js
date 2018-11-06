Template.user_search_card.onRendered(function () {
  let t = this;
  t.$('i[data-tooltip]').tooltip();
});

Template.user_search_card.onDestroyed(function () {
  let t = this;
  t.$('i[data-tooltip]').tooltip('remove');
});

Template.user_search_card.events({
  'click .accept_add_to_contacts'(e, t) {
    Meteor.call('accept_add_to_contacts', this._id, () => {
      t.$(e.target).tooltip('remove');
    });
  },
  'click .deny_add_to_contacts'(e, t) {
    Meteor.call('deny_add_to_contacts', this._id, () => {
      t.$(e.target).tooltip('remove');
    });
  },
  'click .add_to_contacts'(e, t) {
    Meteor.call('request_add_contact', this._id, () => {
      t.$(e.target).tooltip('remove');
    });
  },
  'click .cancel_add_to_contacts'(e, t) {
    Meteor.call('cancel_add_to_contacts', this._id, () => {
      t.$(e.target).tooltip('remove');
    });
  },
  'click .block_contact'(e, t) {
    Meteor.call('block_contact', this._id, () => {
      t.$(e.target).tooltip('remove');
    });
  },
  'click .unblock_contact'(e, t) {
    Meteor.call('unblock_contact', this._id, () => {
      t.$(e.target).tooltip('remove');
    });
  },
});

Template.user_search_card.helpers({
  activate_tooltip() {
    Meteor.setTimeout(() => {
      $(`.user_search_card[data-id=${this._id}] i[data-tooltip]`).tooltip()
    }, 0);
  }
});