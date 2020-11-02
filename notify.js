const { messaging } = require("./firebaseInit");

module.exports = {
  sendNotificationToClient: (tokens, data) => {
    messaging
      .sendMulticast({ tokens, data })
      .then((response) => {
        // const successes = response.responses.filter((r) => r.success === true)
        //   .length;
        // const failures = response.responses.filter((r) => r.success === false)
        //   .length;
        // console.log(
        //   "Notifications sent:",
        //   `${successes} successful, ${failures} failed`
        // );
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
  },
};
