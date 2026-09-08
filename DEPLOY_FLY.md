Fly.io deployment guide for the Express backend

1) Install flyctl and log in

```bash
curl -L https://fly.io/install.sh | sh
fly auth login
```

2) Create the Fly app and a persistent volume for `/app/data`

```bash
fly launch --name the-haven-chat --image node:20-alpine --no-deploy
fly volumes create data --region <your-region> --size 1
```

3) Set secrets (do NOT store secrets in repo)

```bash
fly secrets set ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='strongpassword' JWT_SECRET='replace-this' \
  SMTP_HOST=... SMTP_PORT=587 SMTP_USER=... SMTP_PASS=... EMAIL_TO=contact.thehavenfoundation.org ADMIN_UI_URL=https://www.thehaven.health
```

4) Deploy

```bash
fly deploy
```

5) Update Vercel (frontend) environment variables

- `VITE_API_BASE` = `https://<your-fly-app>.fly.dev` (or your custom API domain)
- `VITE_WS_URL` = `wss://<your-fly-app>.fly.dev`

Set these in Vercel Dashboard -> Project -> Settings -> Environment Variables (Production), then redeploy the frontend.
