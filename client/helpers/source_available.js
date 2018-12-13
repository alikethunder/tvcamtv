import {Sources} from '../collections/Sources'

Template.registerHelper('source_available', function (_id) {
  return Sources.findOne({_id})
});