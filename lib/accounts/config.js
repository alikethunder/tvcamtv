// Options
AccountsTemplates.configure({
  // Behavior
  confirmPassword: true,
  enablePasswordChange: true,
  //forbidClientAccountCreation: false,
  //overrideLoginErrors: true,
  sendVerificationEmail: false, //true,
  //lowercaseUsername: false,
  focusFirstInput: true,

  // Appearance
  //showAddRemoveServices: false,
  showForgotPasswordLink: true,
  showLabels: true,
  showPlaceholders: true,
  showResendVerificationEmailLink: false,

  // Client-side Validation
  //continuousValidation: false,
  negativeFeedback: true,
  negativeValidation: true,
  positiveValidation: true,
  positiveFeedback: true,
  showValidating: true,

  // Privacy Policy and Terms of Use
  //privacyUrl: 'privacy',
  //termsUrl: 'terms-of-use',

  // Redirects
  //homeRoutePath: "/",
  redirectTimeout: 3000,

  // Hooks
  onLogoutHook: () => {
    Router.go('/');
  },
  // Texts
  texts: {
    socialSignIn: "",
    socialSignUp: "",
    socialWith: "",
    requiredField: "Обязательное поле",
    minRequiredLength: "Длина не меньше"
  }
  //more options and full explanation at https://github.com/meteor-useraccounts/core/blob/master/Guide.md
});

T9n.setLanguage('ru');

T9n.map("ru", {
  //emailResetLink: "Отправить ссылку",
  error: {
    accounts: {
      //"Login forbidden": "Неверный пароль"
      "Invalid email": "неправильный email",
      "Invalid email or username": "неправильный email"
    }
  }
});

let pwd = AccountsTemplates.removeField('password');

AccountsTemplates.removeField('email');

AccountsTemplates.addFields([{
  _id: 'email',
  type: 'email',
  required: true,
  displayName: "Email",
  re: /.+@(.+){1,}\.(.+){1,}/,
  errStr: 'Неправильный email',
}, pwd]);