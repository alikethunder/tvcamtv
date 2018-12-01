import {
  Settings
} from '../collections/Settings'

import {
  readFileSync
} from 'fs'

Meteor.methods({
  cert(){
    return readFileSync(Settings.findOne({
      _id: 'ssl_certificates'
    }).cert)
  }
});