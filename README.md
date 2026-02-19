<div align="center">
  <h1>freetweakcn</h1>
  <p><strong>Visual Theme Editor for Tailwind CSS & shadcn/ui — with generous AI limits, free for everyone.</strong></p>
</div>

<br />

**freetweakcn** is a self-hosted fork of [tweakcn](https://github.com/jnsahaj/tweakcn) with the paywall removed. The original tweakcn has a Pro subscription tier — this edition makes everything free with a daily AI usage limit that resets every day.

**Acknowledgments:** Built on the excellent work of [tweakcn](https://github.com/jnsahaj/tweakcn) by [Sahaj](https://github.com/jnsahaj). This fork removes the subscription paywall and makes it self-hostable with any OpenAI-compatible AI provider.

**Why?** The original limits are too tight for real use. If you're building themes regularly, you need more room. Self-host this and use it as much as you need.

## What's Different

| Feature | Original tweakcn | This Edition |
|---|---|---|
| Theme customization | Free | Free |
| AI theme generation | 5 lifetime, then paid | **5/day, resets daily** |
| AI from images | Pro only | **Free** |
| Save themes | Limited free | **Free** |
| Subscription/paywall | Yes ($8/mo) | **None** |
| AI provider | Google Gemini | **Any OpenAI-compatible** |
| Self-hostable | No | **Yes** |

## AI Provider

This edition uses [Novita AI](https://novita.ai/) (Coding plan) as the default AI provider. Novita AI offers an OpenAI-compatible API with access to a wide range of models at competitive pricing.

You can swap to any OpenAI-compatible provider by changing `LLM_BASE_URL` and `LLM_API_KEY` in your environment — [OpenRouter](https://openrouter.ai), [OpenAI](https://platform.openai.com), [Together](https://together.ai), [Groq](https://groq.com), or any other compatible endpoint.

## Self-Hosting

### Prerequisites

- Node.js 18+ and pnpm
- A PostgreSQL database (Neon, Supabase, Railway, any provider — or your own)
- An API key from an OpenAI-compatible provider (defaults to [Novita AI](https://novita.ai/))
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
| `LLM_API_KEY` | API key for your LLM provider |

**Optional variables:**

| Variable | Default | Description |
|---|---|---|
| `LLM_BASE_URL` | `https://api.novita.ai/openai` | Any OpenAI-compatible endpoint |
| `LLM_BASE_MODEL_ID` | `google/gemini-2.5-flash` | Chat model |
| `LLM_THEME_MODEL_ID` | `google/gemini-2.5-flash` | Theme generation model |
| `LLM_PROMPT_MODEL_ID` | `google/gemini-2.5-flash` | Prompt enhancement model |
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

- Built on [tweakcn](https://github.com/jnsahaj/tweakcn) by [Sahaj](https://github.com/jnsahaj) — thank you for creating such an amazing tool!
- AI powered by [Novita AI](https://novita.ai/) (Coding plan) — works with any OpenAI-compatible provider

## Sponsor

**Sponsored by [Ideaplexa LLC](https://ideaplexa.com)**
