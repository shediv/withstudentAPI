//config file. Ignore by GIT.
var config = {
  //Miscellaneous Configs
  secret : "shediv",

  //SMTP Configs
  smtpService : 'smtp.mandrillapp.com',
  smtpHost : 'smtp.mandrillapp.com',
  smtpAuth : {
    user: '', //www.creativecapsule.com
    pass: '' //1C0lKsSFlPkZgOqGBO6exg
  },
  smtpPort:587,

  //Domain Name Configs
  appHost : 'http://139.162.28.169/client/#/',

  apiHost : "http://localhost:9000/#/",    
};

module.exports = config;