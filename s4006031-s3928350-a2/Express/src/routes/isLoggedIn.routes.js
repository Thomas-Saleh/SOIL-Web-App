module.exports = (express, app) => {
  const controller = require("../controllers/isLoggedInController.js");
  const router = express.Router();

  // Get login status of a user.
  router.get("/:userId", controller.getLoginStatus);

  // Log in a user.
  router.post("/", controller.logInUser);

  // Log out a user.
  router.post("/logout", controller.logOutUser);

  // Add routes to server.
  app.use("/api/isLoggedIn", router);
};
