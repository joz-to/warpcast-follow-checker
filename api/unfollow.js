export default async function handler(req, res) {
  const { target } = req.query;
  if (!target) return res.status(400).json({ error: "No target FID provided" });

  res.status(200).json({
    type: "screen",
    title: "Unfollowed",
    description: `You unfollowed FID ${target}`
  });
}