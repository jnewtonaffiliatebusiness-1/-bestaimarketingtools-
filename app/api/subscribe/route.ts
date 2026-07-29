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

    // Resend has two generations of the contacts API live at once:
    //   current: POST /contacts  with segments:[id]
    //   legacy:  POST /audiences/{id}/contacts
    // A newly created account may only accept one of them, and picking wrong returns a 4xx
    // that would surface to the visitor as a generic failure. Try current, fall back to
    // legacy, and log which one answered so this is diagnosable from the Vercel logs.
    const headers = {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    };

    const attempts: Array<{ label: string; url: string; body: unknown }> = [
      {
        label: "current(/contacts)",
        url: "https://api.resend.com/contacts",
        body: { email, segments: [audienceId] },
      },
      {
        label: "legacy(/audiences)",
        url: `https://api.resend.com/audiences/${audienceId}/contacts`,
        body: { email, unsubscribed: false },
      },
    ];

    const failures: string[] = [];
    for (const attempt of attempts) {
      const res = await fetch(attempt.url, {
        method: "POST",
        headers,
        body: JSON.stringify(attempt.body),
      });
      if (res.ok) {
        console.log(`[Subscribe] ok via ${attempt.label}`);
        return NextResponse.json({ success: true });
      }
      failures.push(`${attempt.label} -> ${res.status} ${await res.text()}`);
    }

    // Both generations refused. Never return success here — a silent drop is the bug that
    // discarded every opt-in for 141 days.
    console.error("[Subscribe] Resend rejected both API generations:", failures.join(" | "));
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  } catch (err) {
    console.error("[Subscribe] Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
