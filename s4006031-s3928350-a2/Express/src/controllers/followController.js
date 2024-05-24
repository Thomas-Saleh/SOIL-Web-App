const db = require("../database/index.js");

// Follow a user.
exports.followUser = async (req, res) => {
  const follow = await db.Follow.create({
    follower_id: req.body.follower_id,
    following_id: req.body.following_id
  });
  res.json(follow);
};

// Unfollow a user.
exports.unfollowUser = async (req, res) => {
  const follow = await db.Follow.findOne({
    where: {
      follower_id: req.body.follower_id,
      following_id: req.body.following_id
    }
  });
  if (follow) {
    await follow.destroy();
    res.json({ message: "Unfollowed successfully" });
  } else {
    res.status(404).json({ error: "Follow relationship not found" });
  }
};
