import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());

app.get("/api/auth", (req, res) => {
  const client_id = process.env.GITHUB_CLIENT_ID;
  const redirect_uri = "https://strahova.biz.ua/admin/";
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=repo,user`;
  res.redirect(authUrl);
});
app.post("/api/auth", async (req, res) => {
  const { code } = req.body;
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
  res.json(data);
});

export default app;

