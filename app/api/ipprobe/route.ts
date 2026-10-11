// TEMPORARY: shows only proxy IP headers of the caller, to pick an unspoofable client IP. Removed after testing.
export function GET(req: Request) {
  const h = (k: string) => req.headers.get(k);
  return Response.json({ xff: h("x-forwarded-for"), real: h("x-real-ip"), cf: h("cf-connecting-ip"), tci: h("true-client-ip"), fwd: h("forwarded") });
}
