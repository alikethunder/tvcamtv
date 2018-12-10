export const Partys = new Mongo.Collection('partys');

Meteor.publish('partys', function(){
  return Partys.find({userId: this.userId});
});