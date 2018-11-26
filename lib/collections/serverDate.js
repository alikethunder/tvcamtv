export const ServerDate = new Mongo.Collection('serverDate');

if (Meteor.isServer) {
  ServerDate.upsert({
    _id: 'now'
  }, {
    $set: {
      date: moment().utc().format()
    }
  });
  Meteor.publish(null, function serverDatePublication() {
    return ServerDate.find({});
  });
  Meteor.setInterval(updateDate, 1000 * 1);

  function updateDate() {
    ServerDate.update({
      _id: 'now'
    }, {
      $set: {
        date: moment().utc().format()
      }
    });
  }
}