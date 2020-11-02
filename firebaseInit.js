const admin = require("firebase-admin");

// import { googleApplicationCredentials } from './settings'

// const serviceAccount = require(googleApplicationCredentials);
const { GOOGLE_APPLICATION_CREDENTIALS } = require("./config/keys");
console.log(GOOGLE_APPLICATION_CREDENTIALS);
admin.initializeApp({
  credential: admin.credential.cert(GOOGLE_APPLICATION_CREDENTIALS),
  databaseURL: "https://fir-cloud-messaging-c7269.firebaseio.com",
});

module.exports = {
  messaging: admin.messaging(),
};
