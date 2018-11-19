import {Streams} from '../../collections/Streams'

Template.leftsidenav.onCreated(function(){
  let t = this;
  
});

Template.leftsidenav.onRendered(function(){
  let t = this;
  t.$('.collapsible').collapsible();
  
});

Template.leftsidenav.helpers({
  streams(){
    return Streams.find().fetch()
  }
});