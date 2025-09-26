import express from "express";
import { createUser, getLeaderboard } from "../Controllers/userController.js";

const router = express.Router();

router.post("/users", createUser);
router.get("/leaderboard", getLeaderboard);

export default router;
