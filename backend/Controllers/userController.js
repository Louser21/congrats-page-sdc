import User from "../models/User.js";

export const createUser = async (req, res) => {
  try {
    const { name } = req.body;
    const user = new User({ name, score: 100 });
    await user.save();
    res.json(user);
  } catch (e) {
    res.status(400).json({ error: "Name already taken" });
  }
};

export const getLeaderboard = async (req, res) => {
  const users = await User.find().sort({ score: -1 }).limit(10);
  res.json(users);
};
