import express from "express";
import dotenv from "dotenv";
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

dotenv.config();
const app = express();
app.use(express.json());

const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);

app.get("/", (req, res) => {
  res.json({
    type: "screen",
    title: "Follow Checker",
    description: "Tap button below to check accounts",
    buttons: [{ label: "Check Now", action: "/check" }]
  });
});

app.get("/check", async (req, res) => {
  try {
    const fid = req.query.fid;
    if (!fid) return res.json({ error: "No FID provided" });

    const following = await client.fetchFollowing(fid);
    const followers = await client.fetchFollowers(fid);

    const followingList = following.users.map(u => u.fid);
    const followersList = followers.users.map(u => u.fid);

    const notFollowingBack = followingList.filter(id => !followersList.includes(id));

    res.json({
      type: "list",
      title: "Users Not Following Back",
      items: notFollowingBack.map(id => ({
        title: `FID: ${id}`,
        button: { label: "Unfollow", action: `/unfollow?me=${fid}&target=${id}` }
      }))
    });
  } catch (e) { res.json({ error: e.message }); }
});

app.get("/unfollow", async (req, res) => {
  const { target } = req.query;
  res.json({
    type: "screen",
    title: "Unfollowed",
    description: `You unfollowed FID ${target}`
  });
});

app.listen(3000, () => console.log("Mini App running on port 3000"));
