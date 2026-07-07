// Cloudflare Pages Function: shared completion state for the promo kits.
// GET  /api/state?page=<id>         -> { steps: { "<idx>": { done:true, at:"ISO" } } }
// POST /api/state  { page, step, done } -> updated state (server stamps the time)
//
// Requires a KV namespace bound to this Pages project as PROMO_STATE.

const JSON_HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store"
};

function json(obj, status) {
  return new Response(JSON.stringify(obj), { status: status || 200, headers: JSON_HEADERS });
}

export async function onRequest(context) {
  const { request, env } = context;
  const kv = env.PROMO_STATE;

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: JSON_HEADERS });
  }
  if (!kv) {
    return json({ error: "storage_not_configured", steps: {} }, 500);
  }

  const url = new URL(request.url);

  if (request.method === "GET") {
    const page = (url.searchParams.get("page") || "").slice(0, 120);
    if (!page) return json({ error: "missing_page", steps: {} }, 400);
    const raw = await kv.get("page:" + page);
    return json(raw ? JSON.parse(raw) : { steps: {} });
  }

  if (request.method === "POST") {
    let body;
    try { body = await request.json(); } catch (e) { return json({ error: "bad_json" }, 400); }

    const page = (String(body.page || "")).slice(0, 120);
    const step = (body.step === undefined || body.step === null) ? null : String(body.step).slice(0, 40);
    if (!page || step === null) return json({ error: "missing_page_or_step" }, 400);

    const key = "page:" + page;
    const raw = await kv.get(key);
    const state = raw ? JSON.parse(raw) : { steps: {} };
    if (!state.steps) state.steps = {};

    if (body.done) {
      state.steps[step] = { done: true, at: new Date().toISOString() };
    } else {
      delete state.steps[step];
    }

    await kv.put(key, JSON.stringify(state));
    return json(state);
  }

  return json({ error: "method_not_allowed" }, 405);
}
