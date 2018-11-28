import {
  Settings
} from '../../collections/Settings'

Template.footer.onCreated(function () {
  let t = this;
});

Template.footer.helpers({
  contacts() {
    return Settings.findOne({
      _id: 'contacts'
    })
  }
});