export const Sources = new Mongo.Collection('sources');

Meteor.publish('sources', function(){
  return Sources.find({userId: this.userId});
});

Meteor.publish('source', function(_id){
  return Sources.find({_id, userId: this.userId});
});