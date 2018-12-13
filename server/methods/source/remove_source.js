import {Sources} from '../../collections/Sources'

Meteor.methods({
  remove_source(_id){
    let s = Sources.findOne({_id, userId: this.userId});
    if (s && s.pages > 1){
      Sources.update({_id, userId: this.userId}, {$inc: {pages: -1}})
    } else {
      Sources.remove({_id, userId: this.userId});
    }
  }
})