// TEMPORARY diagnostic: shows which forwarding headers reach the app behind
// ahost's nginx (Engintron) → Apache → Passenger chain, to build a safe
// HTTP→HTTPS redirect. Remove once the redirect ships.
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const h = request.headers;
  const pick = (name: string) => h.get(name);
  return Response.json(
    {
      host: pick("host"),
      xForwardedProto: pick("x-forwarded-proto"),
      xForwardedPort: pick("x-forwarded-port"),
      xForwardedHost: pick("x-forwarded-host"),
      xForwardedSsl: pick("x-forwarded-ssl"),
      frontEndHttps: pick("front-end-https"),
      xHttps: pick("x-https"),
      url: request.url,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
