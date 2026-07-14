import { NextRequest, NextResponse } from "next/server";
import { getAffiliateUrl } from "@/lib/affiliates";

// Where the click came from → utm_medium. Keeps presell/social/paid traffic
// attributable separately from organic review traffic. Defaults to "review",
// so every existing link behaves exactly as before.
const ALLOWED_MEDIUMS = new Set(["review", "presell", "social", "email", "paid"]);

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const base = getAffiliateUrl(slug);

  if (!base) {
    return NextResponse.redirect(new URL("/reviews", _req.url));
  }

  const src = _req.nextUrl.searchParams.get("src") ?? "review";
  const medium = ALLOWED_MEDIUMS.has(src) ? src : "review";

  const url = new URL(base);
  url.searchParams.set("utm_source", "aitoolsreviewshub");
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_campaign", slug);

  return NextResponse.redirect(url.toString(), { status: 302 });
}
