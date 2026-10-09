const ORIGIN = "https://bluecarbonsales-coder.github.io/cloudflare-workers-blog";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname === "/" ? "/" : url.pathname;
    const upstream = new URL(ORIGIN + path);
    upstream.search = url.search;

    const headers = new Headers({
      Accept: request.headers.get("Accept") || "*/*"
    });

    const upstreamResponse = await fetch(upstream, {
      method: request.method,
      headers: headers,
      redirect: "follow"
    });

    const response = new Response(upstreamResponse.body, upstreamResponse);
    response.headers.set("Cache-Control", "public, max-age=300");
    response.headers.set("X-Backend", "github-pages");
    return response;
  }
};