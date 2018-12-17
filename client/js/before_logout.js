import {deviceId} from './deviceId'

export const before_logout = function (cb) {
  //destroy stream & monitor templates & trigger their clean up
  if ($('.add_device')[0]){
    Blaze.remove(Blaze.getView($('.add_device')[0]));
  }

  if ($('.videos_container')[0]){
    Blaze.remove(Blaze.getView($('.videos_container')[0]));
  }

  Meteor.call('remove_source', deviceId, ()=>{
    cb();
  });
}