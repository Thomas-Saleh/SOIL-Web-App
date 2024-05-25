const db = require("../database/index.js");
const argon2 = require("argon2");

// Select all users from the database.
exports.getAllUsers = async (req, res) => {
  const user = await db.user.findAll();
  res.json(user);
};

// Select one user from the database.
exports.getUserById = async (req, res) => {
  const user = await db.user.findByPk(req.params.id);
  res.json(user);
};

// Select one user from the database if email and password are a match.
exports.login = async (req, res) => {
  try {
    const user = await db.user.findOne({ where: { email: req.body.email } });
    if (user && await argon2.verify(user.password, req.body.password)) {
      // Set login status
      await user.update({ isLoggedIn: true });

      res.json(user); // Respond with user data on successful login
    } else {
      res.status(401).json({ message: 'Invalid email or password' }); // Respond with an error message on failure
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

exports.logout = async (req, res) => {
  try {
    const user = await db.user.findByPk(req.body.user_id);
    if (user) {
      await user.update({ isLoggedIn: false });
      res.json({ message: "Logged out successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// Create a user in the database.
exports.createUser = async (req, res) => {
  try {
  const hash = await argon2.hash(req.body.password, { type: argon2.argon2id });
  const user = await db.user.create({
    username: req.body.username,
    email: req.body.email,
    password: hash,
  });
  res.status(201).json(user);
} catch (error) {
  console.error("Error creating user:", error);
  res.status(500).json({ message: error.message });
}
};


// Update a user in the database.
exports.updateUser = async (req, res) => {
  const user = await db.user.findByPk(req.params.id);
  if (user) {
    await user.update(req.body);
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
};

// Delete a user from the database.
exports.deleteUser = async (req, res) => {
  const user = await db.user.findByPk(req.params.id);
  if (user) {
    await user.destroy();
    res.json({ message: "User deleted" });
  } else {
    res.status(404).json({ error: "User not found" });
  }
};
