import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!resendApiKey || !audienceId) {
      // FAIL LOUD. This used to log the address and return success:true, so in any
      // environment missing these vars the visitor was told "you're subscribed" while the
      // address was discarded — an opt-in that silently went nowhere. A visible error is
      // recoverable; a fake success is not, because nobody ever finds out.
      console.error(
        "[Subscribe] MISCONFIGURED: RESEND_API_KEY / RESEND_AUDIENCE_ID not set — subscription rejected rather than silently dropped."
      );
      return NextResponse.json(
        { error: "Subscriptions are temporarily unavailable" },
        { status: 503 }
      );
    }

    const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        unsubscribed: false,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("[Subscribe] Resend error:", err);
      return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Subscribe] Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
