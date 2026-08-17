# Ask endpoint (optional)

A Cloudflare Worker that lets the ask panel answer questions the written
profile does not cover, using Gemini — without ever putting an API key in the
page.

**The site works fine without this.** `ASK_ENDPOINT` in `index.html` is empty
by default, and while it is empty the panel behaves exactly as it always has:
instant keyword answers, and an honest refusal on a miss.

## Why a Worker and not a direct call

A static page cannot hold a secret. Anything in `index.html` is served to every
visitor and readable by all of them, so an API key placed there is a published
key — someone will spend your quota. The key lives in the Worker instead and
never reaches the browser.

## Deploy

```bash
npm i -g wrangler
wrangler login
```

Get a free key from Google AI Studio, then — from this folder:

```bash
wrangler secret put GEMINI_KEY
```

Paste the key at the prompt. It is stored encrypted by Cloudflare. It is not
written to any file here, and it is never committed.

Edit `ALLOWED_ORIGINS` in `wrangler.toml` to your real site URL, then:

```bash
wrangler deploy
```

Copy the deployed URL into `ASK_ENDPOINT` in `index.html`.

## What the design deliberately refuses to do

- **The profile is not accepted from the caller.** It is baked into the Worker.
  If the browser could supply it, anyone could point this endpoint at their own
  prompt and use your Gemini quota as a free general-purpose LLM.
- **The model may not answer from its own knowledge.** The instruction is to
  answer only from the profile and to refuse otherwise. On a scholarship page
  an invented certification is the worst available failure, and nobody would
  notice it happening.
- **Prompt-injection is anticipated.** The system rules tell the model to
  ignore instructions embedded in a visitor's question.
- **Upstream error bodies are never forwarded** — they can echo the key.
- **Generated answers are labelled in the UI**, so a reviewer can tell written
  copy from generated copy.

## Abuse control

The `Origin` check is not a limit — outside a browser that header is trivially
forged. Without throttling, anyone who found this URL could drain the Gemini
quota and leave the panel dead until it reset.

- **6 requests per IP per minute** — far above what a real visitor needs
- **400 requests per day total** — stops a distributed flood that per-IP limits
  would miss, and stays well under the free tier

Both counters live in the isolate's memory, so they are a dampener rather than
a global guarantee: Cloudflare may run several isolates and recycles them. That
is enough for the realistic case (one script hammering the endpoint) and costs
nothing. For a hard ceiling, add a Rate Limiting rule in the Cloudflare
dashboard — the free plan includes them.

A throttled visitor is told to wait a minute, not told the thing is broken:

```bash
node test_throttle.mjs      # 6 checks on the limiter logic
```

## Keeping the profile in sync

`profile.js` is generated from the KB in `index.html`:

```bash
python make_profile.py
```

Entries whose answers are still `[placeholders]` are skipped on purpose —
grounding the model on `[Your CGPA...]` would teach it to state that as fact.
Currently 30 of 36 entries are grounded; the 6 skipped are the ones still
waiting on your real data.

## Cost

Gemini's free tier covers a portfolio's traffic comfortably, and Cloudflare
Workers' free tier is 100k requests/day. Check both providers' current limits —
they change. The Worker is only called when the keyword matcher misses, so most
visits cost nothing at all.
