// DarkSearch - Proxy Cloudflare Worker
// Deploie ce code sur https://workers.cloudflare.com (gratuit)

const API_KEY = "24dab2ebe7a7fe257ec983a8af54cefc08b1f30df10a5dbade46aa6ac9447cec";
const API_URL = "https://oathnet.org/api/service/search-breach";

export default {
  async fetch(request) {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "*",
        }
      });
    }

    const url = new URL(request.url);
    const q = url.searchParams.get("q");

    if (!q) {
      return new Response(JSON.stringify({ error: "Paramètre q manquant" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    try {
      const res = await fetch(`${API_URL}?q=${encodeURIComponent(q)}`, {
        headers: { "x-api-key": API_KEY }
      });
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        status: res.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store"
        }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
  }
};
