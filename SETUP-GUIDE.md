# Take Time — Deployment Guide
## GitHub → Vercel in about 15 minutes

---

## Step 1: Set Firebase Security Rules

1. Go to console.firebase.google.com → your Take Time project
2. Click **Realtime Database** in the left sidebar
3. Click the **Rules** tab at the top
4. Replace everything there with this:

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

5. Click **Publish**

---

## Step 2: Create a GitHub Repository

1. Go to github.com and sign in
2. Click the **+** button (top right) → **New repository**
3. Name it: `take-time`
4. Leave it **Public**
5. Do NOT check "Add a README" (leave everything unchecked)
6. Click **Create repository**
7. GitHub will show you a page — leave it open, you'll need the URL

---

## Step 3: Upload the Code

On the GitHub page that appeared after creating the repo:

1. Click **"uploading an existing file"** (it's a link in the middle of the page)
2. You'll see a drag-and-drop area
3. Upload these files and folders — **keep the folder structure exactly as shown**:

```
take-time/
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   ├── firebase.js
│   ├── gameData.js
│   └── index.js
└── package.json
```

4. Scroll down, click **Commit changes**

---

## Step 4: Deploy on Vercel

1. Go to vercel.com and sign in (or create a free account)
2. Click **Add New → Project**
3. Click **Import** next to your `take-time` repository
4. Vercel will auto-detect it as a React app — leave all settings as-is
5. Click **Deploy**
6. Wait about 2 minutes — Vercel builds and deploys automatically
7. You'll get a URL like `take-time.vercel.app` — that's your game!

---

## Step 5: Test It

1. Open the URL on your phone
2. Create a room, note the 4-letter code
3. Have someone else open the same URL on their phone and join with the code
4. You should both see each other in the waiting room — it's live!

---

## Making Updates Later

Whenever Claude gives you updated code, just go back to your GitHub repo, click the file you want to update, click the pencil ✏️ icon to edit it, paste the new code, and click **Commit changes**. Vercel automatically redeploys within a minute or two.

---

## Troubleshooting

**"Room not found"** — Make sure Firebase rules are published (Step 1)

**Blank white screen** — Check the Vercel deployment logs (click your project → Deployments → the latest one → View logs)

**Players not seeing each other update** — Firebase Realtime Database pushes updates instantly; if it's not working, double-check the firebase.js file has your correct databaseURL
