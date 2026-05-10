// ═══════════════════════════════════════════════════════
// FUTURE ME — Cloudflare Worker (Gemini API Proxy)
// Deploy: dash.cloudflare.com → Workers → Create
// Add secret: GEM_KEY = AIzaSyDwUCq8bk88GlrX6r7tDF7759cirBRI5PM
// ═══════════════════════════════════════════════════════

const GEM_MODEL = "gemini-2.0-flash";
const ALLOWED_ORIGIN = "*"; // Change to your GitHub Pages URL for extra security
                             // e.g. "https://rusthicrush.github.io"

export default {
  async fetch(request, env) {

    // ── CORS preflight ──────────────────────────────────
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // ── Only POST /api/generate ─────────────────────────
    const url = new URL(request.url);
    if (request.method !== "POST" || url.pathname !== "/api/generate") {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: corsHeaders(ALLOWED_ORIGIN),
      });
    }

    try {
      const { messages, system, maxTokens = 1000 } = await request.json();

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return errorResponse("Invalid messages", 400, ALLOWED_ORIGIN);
      }

      // Convert to Gemini format
      const gemHistory = [];
      for (let i = 0; i < messages.length - 1; i++) {
        gemHistory.push({
          role: messages[i].role === "assistant" ? "model" : "user",
          parts: [{ text: messages[i].content }],
        });
      }

      // System instruction as first exchange if provided
      const fullContents = system
        ? [
            { role: "user",  parts: [{ text: "[SYSTEM CONTEXT]\n" + system }] },
            { role: "model", parts: [{ text: "Understood. I will follow these instructions." }] },
            ...gemHistory,
            { role: "user",  parts: [{ text: messages[messages.length - 1].content }] },
          ]
        : [
            ...gemHistory,
            { role: "user",  parts: [{ text: messages[messages.length - 1].content }] },
          ];

      // Call Gemini — API key from Worker secret (never exposed to client)
      const gemRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEM_MODEL}:generateContent?key=${env.GEM_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: fullContents,
            generationConfig: {
              maxOutputTokens: maxTokens,
              temperature: 0.9,
            },
          }),
        }
      );

      if (!gemRes.ok) {
        const errData = await gemRes.json().catch(() => ({}));
        const msg = errData.error?.message || `Gemini HTTP ${gemRes.status}`;
        return errorResponse(msg, gemRes.status, ALLOWED_ORIGIN);
      }

      const gemData = await gemRes.json();
      const text = gemData.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!text) return errorResponse("Empty response from Gemini", 502, ALLOWED_ORIGIN);

      return new Response(JSON.stringify({ text }), {
        headers: { "Content-Type": "application/json", ...corsHeaders(ALLOWED_ORIGIN) },
      });

    } catch (err) {
      return errorResponse(err.message || "Worker error", 500, ALLOWED_ORIGIN);
    }
  },
};

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function errorResponse(message, status, origin) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}
