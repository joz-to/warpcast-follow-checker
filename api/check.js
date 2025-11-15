import { NeynarAPIClient } from "@neynar/nodejs-sdk";
const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);

export default async function handler(req, res) {
  const fid = req.query.fid;
  if (!fid) return res.status(400).json({ error: "No FID provided" });

  try {
    const following = await client.fetchFollowing(fid);
    const followers = await client.fetchFollowers(fid);

    const followingList = following.users.map(u => u.fid);
    const followersList = followers.users.map(u => u.fid);

    const notFollowingBack = followingList.filter(id => !followersList.includes(id));

    res.status(200).json({
      type: "list",
      title: "Users Not Following Back",
      items: notFollowingBack.map((id) => ({
        title: `FID: ${id}`,
        button: { label: "Unfollow", action: `/api/unfollow?me=${fid}&target=${id}` }
      }))
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}