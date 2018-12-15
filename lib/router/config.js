Router.configure({
  layoutTemplate: "screen",
});

//Routes
AccountsTemplates.configureRoute('changePwd', {
  redirect: '/client'
});
AccountsTemplates.configureRoute('enrollAccount', {
  redirect: '/client'
});
AccountsTemplates.configureRoute('forgotPwd', {
  redirect: '/client'
});
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

AccountsTemplates.configureRoute('verifyEmail', {
  redirect: '/client'
});

Router.onBeforeAction(function () {
  if (Meteor.isClient) {
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