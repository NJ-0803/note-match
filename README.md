# Note Match

Find perfumes by scent notes — search a perfume you love (or describe a scent in your own words) and get back similar perfumes ranked by note similarity, with India retailer buy links.

## Stack
- Next.js (App Router) + TypeScript + Tailwind CSS
- Fuse.js for fuzzy name search
- Recharts for the note pyramid / scent DNA radar charts
- Groq API (`llama-3.1-8b-instant`, free tier) for AI-powered recommendation ranking, match explanations, note descriptions, and live free-text search

## Setup

```bash
npm install
```

Create `.env.local` with your Groq API key (free, no credit card — sign up at console.groq.com):

```
GROQ_API_KEY=gsk_...
```

## Generating the AI data

The core dataset (`data/perfumes.json`) is static and already included. Two scripts generate the AI-derived data on top of it — run these once, and again whenever `perfumes.json` changes:

```bash
node scripts/build-recommendations.mjs   # similarity rankings + match explanations (~1-1.5hr on the free tier)
node scripts/build-explanations.mjs      # plain-English note descriptions (resumable if rate-limited)
```

Both are one-time batch costs — the live site doesn't call the AI for these, only for free-text search.

## Development

```bash
npm run dev
```

## Deployment

Deployed on Vercel. Requires a `GROQ_API_KEY` environment variable set on the hosting platform for the live free-text search feature to work.
