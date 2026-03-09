import { NextRequest, NextResponse } from "next/server";
import { getAffiliateUrl } from "@/lib/affiliates";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const base = getAffiliateUrl(slug);

  if (!base) {
    return NextResponse.redirect(new URL("/reviews", _req.url));
  }

  const url = new URL(base);
  url.searchParams.set("utm_source", "aitoolsreviewshub");
  url.searchParams.set("utm_medium", "review");
  url.searchParams.set("utm_campaign", slug);

  return NextResponse.redirect(url.toString(), { status: 302 });
}
