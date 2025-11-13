import { Octokit } from "@octokit/core";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ error: "Missing code" });

    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const data = await response.json();
    if (data.error) throw data;

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Authentication failed", details: error });
  }
}


