<div align="center">
  <h1>tweakcn (Free Self-Hosted Edition)</h1>
  <p><strong>Visual Theme Editor for Tailwind CSS & shadcn/ui — with generous AI limits, free for everyone.</strong></p>
</div>

<br />

This is a self-hostable fork of [tweakcn](https://github.com/jnsahaj/tweakcn) with the paywall removed. The original tweakcn has a Pro subscription tier — this edition makes everything free with a daily AI usage limit that resets every day.

**Why?** The original limits are too tight for real use. If you're building themes regularly, you need more room. Self-host this and use it as much as you need.

## What's Different

| Feature | Original tweakcn | This Edition |
|---|---|---|
| Theme customization | Free | Free |
| AI theme generation | 5 lifetime, then paid | **5/day, resets daily** |
| AI from images | Pro only | **Free** |
| Save themes | Limited free | **Free** |
| Subscription/paywall | Yes ($8/mo) | **None** |
| AI provider | Google Gemini | **GLM (Z.ai)** |
| Self-hostable | No | **Yes** |

## Self-Hosting

### Prerequisites

- Node.js 18+ and pnpm
- A PostgreSQL database (Neon, Supabase, Railway, any provider — or your own)
- A [Z.ai](https://z.ai/model-api) API key (free tier available)
- OAuth credentials (Google or GitHub) for user authentication

### 1. Clone and install

```bash
git clone https://github.com/moinulmoin/tweakcnfree.git
cd tweakcnfree
pnpm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

**Required variables:**

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Any random string for session encryption |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID ([setup](https://www.better-auth.com/docs/authentication/google)) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GLM_API_KEY` | Z.ai API key from [z.ai/model-api](https://z.ai/model-api) |

**Optional variables:**

| Variable | Default | Description |
|---|---|---|
| `GLM_BASE_URL` | `https://api.z.ai/api/coding/paas/v4` | Z.ai endpoint (coding plan, regular, or China) |
| `GLM_BASE_MODEL_ID` | `glm-4.6v` | Vision model for chat + image input |
| `GLM_THEME_MODEL_ID` | `glm-4.7` | Flagship model for theme generation |
| `GLM_PROMPT_MODEL_ID` | `glm-4.7-flash` | Fast model for prompt enhancement |
| `GITHUB_CLIENT_ID` | — | GitHub OAuth (alternative to Google) |
| `GITHUB_CLIENT_SECRET` | — | GitHub OAuth secret |
| `GOOGLE_FONTS_API_KEY` | — | Enables the font browser |

### 3. Push database schema

```bash
pnpm drizzle-kit push
```

### 4. Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production deployment

```bash
pnpm build
pnpm start
```

Works on Vercel, Railway, Fly.io, any Node.js host. The database is external (just a URL), so there are no Docker/volume concerns — deploy the app anywhere and point `DATABASE_URL` at your PostgreSQL instance.

## Adjusting Limits

Edit `lib/constants.ts` to change the daily AI request limit:

```ts
export const AI_REQUEST_FREE_TIER_LIMIT = 5; // per day — change to whatever you want
```

## Credits

- Built on [tweakcn](https://github.com/jnsahaj/tweakcn) by [Sahaj](https://github.com/jnsahaj)
- AI powered by [Zhipu AI / Z.ai](https://z.ai) GLM models via [zhipu-ai-provider](https://github.com/Xiang-CH/zhipu-ai-provider), using the [Z.ai Coding Plan](https://z.ai/pricing)

## Sponsor

**Sponsored by [Ideaplexa LLC](https://ideaplexa.com)**
