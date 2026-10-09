# Daily Ops Blog

A serverless operational blog served at `https://blog.nafisainternational.com`.

## Stack

- GitHub Pages stores and publishes the static site.
- Cloudflare Workers serves it at the custom domain and adds edge caching.
- No origin server, no database.

## Files

- `index.html` — homepage with latest posts and today's checklist.
- `daily.html` — full everyday task list.
- `posts/` — blog posts.
- `assets/` — CSS, JavaScript and task data.
- `worker/daily-blog.js` — Cloudflare Worker used for deployment.

## Deploy

1. Push the repository to GitHub; GitHub Pages publishes from the `master` branch root.
2. Deploy `worker/daily-blog.js` as a Cloudflare Worker named `daily-blog`.
3. Route `blog.nafisainternational.com/*` to that Worker.