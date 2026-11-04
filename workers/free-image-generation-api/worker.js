/**
 * Cloudflare Worker for Free AI Image Generation (100,000 calls/day)
 * Based on: https://github.com/saurav-z/free-image-generation-api
 */

export default {
  async fetch(request, env) {
    const API_KEY = env.API_KEY;
    const url = new URL(request.url);
    const auth = request.headers.get("Authorization");

    // Optional CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // 🔐 Simple API key check (if API_KEY is set in environment)
    if (API_KEY && auth !== `Bearer ${API_KEY}`) {
      return json({ error: "Unauthorized" }, 401, corsHeaders);
    }

    // 🚫 Only allow POST requests
    if (request.method !== "POST") {
      return json({ error: "Method not allowed. Use POST." }, 405, corsHeaders);
    }

    try {
      const { prompt, model, num_steps, guidance } = await request.json();

      if (!prompt) {
        return json({ error: "Prompt is required" }, 400, corsHeaders);
      }

      // Available models:
      // "@cf/stabilityai/stable-diffusion-xl-base-1.0"
      // "@cf/blackforestlabs/flux-1-schnell"
      // "@cf/bytedance/stable-diffusion-xl-lightning"
      // "@cf/lykon/dreamshaper-8-lcm"
      const selectedModel = model || "@cf/stabilityai/stable-diffusion-xl-base-1.0";

      // 🧠 Generate image from prompt using Cloudflare Workers AI
      const result = await env.AI.run(selectedModel, {
        prompt,
        num_steps: num_steps || 20,
        guidance: guidance || 7.5,
      });

      return new Response(result, {
        headers: {
          "Content-Type": "image/jpeg",
          ...corsHeaders,
        },
      });
    } catch (err) {
      return json(
        { error: "Failed to generate image", details: err.message },
        500,
        corsHeaders
      );
    }
  },
};

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...extraHeaders,
    },
  });
}
