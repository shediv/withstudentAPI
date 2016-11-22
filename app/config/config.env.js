/*
  Description : Add all the app related configuration data in this file. DO NOT ADD project functionality specific settings here.

*/
module.exports = {
    ports: [9000],
    //Database Configs
    mongoUrl: "mongodb://localhost:27017/WithStudent_alpha",
    //mongoUrl: "mongodb://root:root@ds147777.mlab.com:47777/withstudent",
    dataLimit: "50mb",
    envDevelopment: "development"

};
