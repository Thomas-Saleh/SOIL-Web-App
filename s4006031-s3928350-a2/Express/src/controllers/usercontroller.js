const db = require("../database/index.js");
const argon2 = require("argon2");
const jwt = require('jsonwebtoken');


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
      // Generate JWT token
      const token = jwt.sign({ user_id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Respond with user data and token
      res.json({ user, token });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
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
    created_at: new Date()
  });
  res.status(201).json(user);
} catch (error) {
  console.error("Error creating user:", error);
  res.status(500).json({ message: error.message });
}
};


// Update a user in the database.
exports.updateUser = async (req, res) => {
  try {
    const user = await db.user.findByPk(req.params.id);
    if (user) {
      const updatedFields = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password ? await argon2.hash(req.body.password, { type: argon2.argon2id }) : user.password,
        age: req.body.age,
        height: req.body.height,
        weight: req.body.weight,
        activity_level: req.body.activity_level,
        dietary_preferences: req.body.dietary_preferences,
        health_goals: req.body.health_goals,
      };
      await user.update(updatedFields);
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
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
