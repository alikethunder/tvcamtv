Router.configure({
  layoutTemplate: "screen",
  //loadingTemplate: "Loader",
  //notFoundTemplate: "404",
});

/*Router.plugin('ensureSignedIn', {
  only: ['document']
});*/

//Routes
AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('enrollAccount');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd', {
  redirect: '/'
});
AccountsTemplates.configureRoute('signIn', {
  redirect: '/client'
});
AccountsTemplates.configureRoute('signUp', {
  redirect() {
    return `/client`
  },
});

AccountsTemplates.configureRoute('verifyEmail');

Router.onBeforeAction(function () {
  if (Meteor.isClient) {
    if (Iron.Location.get().port != 3000 && window.location.protocol != "https:" && document.location.protocol != "https:"){
      window.location = `https://${window.location.hostname}${window.location.pathname}${window.location.search}`;
    }
    
    if (Meteor.userId()) {
      switch (this.route.options.name) {
        case 'atSignIn':
        case 'atForgotPwd':
        case 'atSignUp':
          Router.go('/client');
          break;
        default:
          this.next();
          break;
      }
    } else {
      switch (this.route.options.name) {
        case 'client':
        case 'add_stream':
        case 'monitor':
        case 'channels_payment':
        case 'stream':
          Router.go('/sign-up');
          break;
        default:
          this.next();
          break;
      }
    }
  }
});

Router.onAfterAction(function () {
  if (Meteor.isClient) {
    $('#leftsidenav').addClass('leftsidenav_closed');
  }
});