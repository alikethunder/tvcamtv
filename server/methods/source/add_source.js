import {Sources} from '../../collections/Sources'

Meteor.methods({
  add_source(_id){
    if (Sources.findOne({_id})){
      Sources.update({_id, userId: this.userId}, {$inc: {pages: 1}})
    } else {
      Sources.insert({_id, userId: this.userId, pages: 1})
    }
  }
})