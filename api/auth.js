// api/auth.js
export default async function handler(req, res) {
  const { query } = req;

  if (query.code) {
    // коли GitHub повертає код — обробляємо його
    const params = new URLSearchParams();
    params.append("client_id", process.env.GITHUB_CLIENT_ID);
    params.append("client_secret", process.env.GITHUB_CLIENT_SECRET);
    params.append("code", query.code);

    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: params,
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error_description });
    }

    // повертаємо токен CMS-у
    res.status(200).json(data);
  } else {
    res.status(400).json({ error: "Missing ?code parameter" });
  }
}
