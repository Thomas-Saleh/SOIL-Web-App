module.exports = (express, app) => {
  const controller = require("../controllers/userController.js");
  const router = express.Router();

  // Select all users.
  router.get("/", controller.getAllUsers);

  // Select a single user with id.
  router.get("/:id", controller.getUserById);

  // Select one user from the database if username and password are a match.
  router.post("/login", controller.login);

  router.post("/logout", controller.login);

  // Create a new user.
  router.post("/", controller.createUser);

  router.put("/:id", controller.updateUser);

  router.delete("/:id", controller.deleteUser);

   // Clear user session.
   router.put("/clear/:id", controller.clearUser);

  // Add routes to server.
  app.use("/api/users", router);
};
