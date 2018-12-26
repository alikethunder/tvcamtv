import { Settings } from "../collections/Settings";

Meteor.methods({
  client_update(key, collection, search_query, update_query){
    if (key == Settings.findOne({_id: 'secret_key'}).key){
      Mongo.Collection.get('translations').update(search_query, update_query)
    } else return 'wrong key'
  }
})