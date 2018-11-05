Router.configure({
  layoutTemplate: "box",
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
  if (Meteor.userId()) {
    switch (this.route.options.name){
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
    switch (this.route.options.name){
      case 'client':
      case 'user_info':
      case 'users':
        Router.go('/sign-up');
        break;
      default:
        this.next();
        break;
    }
  }
});

Router.onAfterAction(function () {
  $('#leftsidenav').addClass('leftsidenav_closed');
});