import {
  Streams
} from '../../collections/Streams'
import {
  deviceId
} from '../../js/deviceId'
import {
  Settings
} from '../../collections/Settings';

Template.leftsidenav.onCreated(function () {
  let t = this;

});

Template.leftsidenav.onRendered(function () {
  let t = this;
  t.$('.collapsible').collapsible();
  t.$('#leftsidenav').removeClass('leftsidenav_closed');

  new MutationObserver((m) => {
    m.forEach((m) => {
      if (m.attributeName == 'class') {
        if ($(m.target).prop(m.attributeName)) {
          $('.leftsidenav_control i').addClass('rotate')
        } else {
          $('.leftsidenav_control i').removeClass('rotate')
        }
      }
    });
  }).observe(t.$('#leftsidenav')[0], {
    attributes: true
  });

});

Template.leftsidenav.helpers({
  streams() {
    return Streams.find({}, {
      sort: {
        created: 1
      }
    }).fetch()
  },
  more_than_one_channel(l) {
    return l > 1
  },
  aliexpress_advertisement() {
    return Settings.findOne({
      _id: 'aliexpress_advertisement'
    }).content
  },
  google_adsense_advertisement() {
    return Settings.findOne({
      _id: 'google_adsense_advertisement'
    }).content
  }
});