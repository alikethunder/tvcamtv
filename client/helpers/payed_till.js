Template.registerHelper('payed_till', function (date) {
  Session.get('language');
  return moment(date).utc().format('LL')
});