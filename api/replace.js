export default async function handler(req, res) {
  const url = "https://hyundai-two-phi.vercel.app" + req.url;
  const response = await fetch(url);
  let html = await response.text();

  html = html.replace(/동북부/g, "충북");

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
