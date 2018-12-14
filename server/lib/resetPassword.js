Accounts.emailTemplates.resetPassword = {
  subject: (user)=>{
    let lang = (user && user.profile && user.profile.language) || "en";
    return emails.findOne({_id: `resetPassword:${lang}`}).subject
  },
  html: (user, url)=>{
    let lang = (user && user.profile && user.profile.language) || "en";
    let e = emails.findOne({_id: `resetPassword:${lang}`});
    return e.html.replace("[subject]", e.subject).replace("[link:reset-password]", String(url))
  }
}