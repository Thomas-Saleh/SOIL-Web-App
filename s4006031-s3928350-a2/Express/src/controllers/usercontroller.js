const db = require("../database/index.js");
const argon2 = require("argon2");

// Select all users from the database.
exports.getAllUsers = async (req, res) => {
  const user = await db.User.findAll();
  res.json(user);
};

// Select one user from the database.
exports.getUserById = async (req, res) => {
  const user = await db.ser.findByPk(req.params.id);
  res.json(user);
};

// Select one user from the database if username and password are a match.
exports.login = async (req, res) => {
  const user = await db.User.findOne({ where: { username: req.query.username } });
  if (user === null || await argon2.verify(user.password, req.query.password) === false) {
    res.json(null); // Login failed.
  } else {
    res.json(user);
  }
};

// Create a user in the database.
exports.createUser = async (req, res) => {
  try {
  const hash = await argon2.hash(req.body.password, { type: argon2.argon2id });
  const user = await db.User.create({
    username: req.body.username,
    email: req.body.email,
    password: hash,
    age: req.body.age,
    height: req.body.height,
    weight: req.body.weight,
    activity_level: req.body.activity_level,
    dietary_preferences: req.body.dietary_preferences,
    health_goals: req.body.health_goals
  });
  res.status(201).json(user);
} catch (error) {
  console.error("Error creating user:", error);
  res.status(500).json({ message: error.message });
}
};


// Update a user in the database.
exports.updateUser = async (req, res) => {
  const user = await db.User.findByPk(req.params.id);
  if (user) {
    await user.update(req.body);
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
};

// Delete a user from the database.
exports.deleteUser = async (req, res) => {
  const user = await db.User.findByPk(req.params.id);
  if (user) {
    await user.destroy();
    res.json({ message: "User deleted" });
  } else {
    res.status(404).json({ error: "User not found" });
  }
};
