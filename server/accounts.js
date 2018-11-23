Accounts.onCreateUser(function (options, user) {
  if (options.profile && user.services) {
    let service = Object.keys(user.services)[0];
    let email = user.services[service].email;
    let oldUser = email && Meteor.users.findOne({
      "emails.address": email
    });
    if (email && oldUser) {
      if (service === "google" || service === "facebook" || service === "linkedin") {
        oldUser.services = oldUser.services || {};
        oldUser.services[service] = user.services[service];
        Meteor.users.remove(oldUser._id);
        user = oldUser;
      }
    }
    if (user.services.facebook) {
      options.profile.picture = "https://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
      options.profile.first_name = user.services.facebook.first_name;
      options.profile.last_name = user.services.facebook.last_name;
      options.profile.language = user.services.facebook.locale.slice(0, 2);
      options.profile.gender = user.services.facebook.gender;
      user.emails = user.emails || [];
      user.emails.push({
        address: user.services.facebook.email,
        verified: true
      });
    } else if (user.services.google) {
      options.profile.picture = user.services.google.picture;
      options.profile.first_name = user.services.google.given_name;
      options.profile.last_name = user.services.google.family_name;
      options.profile.language = user.services.google.locale;
      options.profile.gender = user.services.google.gender;
      user.emails = user.emails || [];
      user.emails.push({
        address: user.services.google.email,
        verified: true
      });
    } else if (user.services.linkedin) {
      options.profile.picture = user.services.linkedin.pictureUrl;
      options.profile.first_name = user.services.linkedin.firstName;
      options.profile.last_name = user.services.linkedin.lastName;
      user.emails = user.emails || [];
      user.emails.push({
        address: user.services.linkedin.emailAddress,
        verified: true
      });
    }
  }
  user.profile = options.profile || {};

  return user;
});