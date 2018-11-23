import {
  Streams
} from '../../collections/Streams'

Template.monitor.onCreated(function () {
  let t = this;
  t.streams_cursor = Streams.find();
});

Template.monitor.onRendered(function () {
  let t = this;

  console.log(Template.monitor.__helpers.get('streams').call());

  

  // reload page if stream added or changed constraints
  t.autorun(()=>{
    t.streams_cursor.observeChanges({
      added(id, stream){
        if (stream.constraints.video || stream.constraints.audio){
          location.reload()
        }
      },
      changed(id, stream){
        if (stream.constraints){
          location.reload()
        }
      }
    })
  });
});

Template.monitor.onDestroyed(function () {
  let t = this;

});

Template.monitor.helpers({
  streams() {
    return Template.instance().streams_cursor.fetch()
  }
});

Template.monitor.events({

});