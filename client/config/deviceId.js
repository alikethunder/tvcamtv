let d = localStorage.getItem('deviceId');
if (!d){
  localStorage.setItem('deviceId', new Mongo.ObjectID()._str);
}