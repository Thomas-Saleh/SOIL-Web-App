const db = require("../database/index.js");
// Get login status of a user.
exports.getLoginStatus = async (req, res) => {
  const status = await db.IsLoggedIn.findOne({ where: { user_id: req.params.userId } });
  res.json(status);
};

// Log in a user.
exports.logInUser = async (req, res) => {
  const status = await db.IsLoggedIn.create({
    user_id: req.body.user_id,
    is_logged_in: true
  });
  res.json(status);
};

// Log out a user.
exports.logOutUser = async (req, res) => {
  const status = await db.IsLoggedIn.findOne({ where: { user_id: req.body.user_id, is_logged_in: true } });
  if (status) {
    await status.update({ is_logged_in: false });
    res.json({ message: "Logged out successfully" });
  } else {
    res.status(404).json({ error: "Login status not found" });
  }
};
