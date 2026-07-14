/**
 * Affiliate URL registry.
 * Keys = review slugs. Values = destination URLs.
 *
 * TO USE YOUR AFFILIATE LINK:
 * Replace the URL with your tracked affiliate link, e.g.:
 *   "instantly-ai-review": "https://instantly.ai/?via=YOURCODE",
 *
 * All redirects go through /go/[slug] which appends UTM params automatically.
 */
export const AFFILIATE_URLS: Record<string, string> = {
  // ─── AI Marketing Automation ──────────────────────────────────────────────
  "instantly-ai-review":    "https://instantly.ai",
  "smartlead-review":       "https://smartlead.ai",
  "lemlist-review":         "https://lemlist.com",
  "apollo-io-review":       "https://apollo.io",
  "reply-io-review":        "https://reply.io",
  "woodpecker-review":      "https://woodpecker.co",
  "mailshake-review":       "https://mailshake.com",
  "jasper-review":          "https://jasper.ai",
  "copy-ai-review":         "https://copy.ai",
  "writesonic-review":      "https://writesonic.com",
  "opus-clip-review":       "https://opus.pro",
  "descript-review":        "https://descript.com",
  "predis-ai-review":       "https://predis.ai",
  "flick-review":           "https://flick.social",
  "taplio-review":          "https://taplio.com",
  "adcreative-ai-review":   "https://adcreative.ai",
  "pencil-ads-review":      "https://www.trypencil.com",
  "madgicx-review":         "https://madgicx.com",
  "motion-app-review":      "https://usemotion.com",
  "foreplay-review":        "https://foreplay.co",

  // ─── Email Marketing ──────────────────────────────────────────────────────
  // TODO(JZooLU): replace with the tracked Systeme.io affiliate link (60% lifetime recurring).
  // Until then this earns $0 — the raw URL is a placeholder so the CTA still resolves.
  "systeme-io-review":        "https://systeme.io",
  "mailchimp-review":         "https://mailchimp.com",
  "activecampaign-review":    "https://www.activecampaign.com",
  "convertkit-review":        "https://kit.com",
  "klaviyo-review":           "https://www.klaviyo.com",
  "drip-review":              "https://drip.com",
  "aweber-review":            "https://www.aweber.com",
  "getresponse-review":       "https://www.getresponse.com",
  "brevo-review":             "https://www.brevo.com",
  "omnisend-review":          "https://www.omnisend.com",
  "moosend-review":           "https://moosend.com",
  "mailerlite-review":        "https://www.mailerlite.com",
  "campaign-monitor-review":  "https://www.campaignmonitor.com",
  "hubspot-email-review":     "https://www.hubspot.com/products/marketing/email",
  "constant-contact-review":  "https://www.constantcontact.com",
  "benchmark-email-review":   "https://www.benchmarkemail.com",
  "zoho-campaigns-review":    "https://www.zoho.com/campaigns",
  "flodesk-review":           "https://flodesk.com",
  "sendgrid-review":          "https://sendgrid.com",
  "keap-review":              "https://keap.com",
  "iterable-review":          "https://iterable.com",

  // ─── SEO & Content Tools ──────────────────────────────────────────────────
  "ahrefs-review":            "https://ahrefs.com",
  "semrush-review":           "https://www.semrush.com",
  "surfer-seo-review":        "https://surferseo.com",
  "frase-io-review":          "https://www.frase.io",
  "clearscope-review":        "https://www.clearscope.io",
  "marketmuse-review":        "https://www.marketmuse.com",
  "moz-pro-review":           "https://moz.com/products/pro",
  "screaming-frog-review":    "https://www.screamingfrog.co.uk/seo-spider",
  "mangools-review":          "https://mangools.com",
  "ubersuggest-review":       "https://neilpatel.com/ubersuggest",
  "se-ranking-review":        "https://seranking.com",
  "rank-math-review":         "https://rankmath.com",
  "yoast-seo-review":         "https://yoast.com/wordpress/plugins/seo",
  "majestic-seo-review":      "https://majestic.com",
  "spyfu-review":             "https://www.spyfu.com",
  "brightlocal-review":       "https://www.brightlocal.com",
  "nightwatch-seo-review":    "https://nightwatch.io",
  "sitebulb-review":          "https://sitebulb.com",
  "raven-tools-review":       "https://raventools.com",
  "conductor-seo-review":     "https://www.conductor.com",

  // ─── Social Media & Analytics ─────────────────────────────────────────────
  "buffer-review":            "https://buffer.com",
  "hootsuite-review":         "https://www.hootsuite.com",
  "sprout-social-review":     "https://sproutsocial.com",
  "metricool-review":         "https://metricool.com",
  "later-app-review":         "https://later.com",
  "planoly-review":           "https://www.planoly.com",
  "publer-review":            "https://publer.io",
  "socialbee-review":         "https://socialbee.com",
  "meetedgar-review":         "https://meetedgar.com",
  "sendible-review":          "https://www.sendible.com",
  "iconosquare-review":       "https://www.iconosquare.com",
  "brandwatch-review":        "https://www.brandwatch.com",
  "mention-review":           "https://mention.com",
  "keyhole-review":           "https://keyhole.co",
  "emplifi-review":           "https://emplifi.io",
  "agorapulse-review":        "https://www.agorapulse.com",
  "coschedule-review":        "https://coschedule.com",
  "loomly-review":            "https://www.loomly.com",
  "tailwind-app-review":      "https://www.tailwindapp.com",
  "vista-social-review":      "https://vistasocial.com",

  // ─── CRM & Sales Automation ───────────────────────────────────────────────
  "hubspot-crm-review":           "https://www.hubspot.com/products/crm",
  "gohighlevel-review":           "https://www.gohighlevel.com/?fp_ref=jzoolu",
  "pipedrive-review":             "https://www.pipedrive.com",
  "close-crm-review":             "https://www.close.com",
  "salesforce-review":            "https://www.salesforce.com",
  "monday-crm-review":            "https://monday.com/crm",
  "zoho-crm-review":              "https://www.zoho.com/crm",
  "freshsales-review":            "https://www.freshworks.com/crm/sales",
  "copper-crm-review":            "https://www.copper.com",
  "nimble-crm-review":            "https://www.nimble.com",
  "keap-crm-review":              "https://keap.com",
  "activecampaign-crm-review":    "https://www.activecampaign.com/crm",
  "streak-crm-review":            "https://www.streak.com",
  "insightly-review":             "https://www.insightly.com",
  "engagebay-review":             "https://www.engagebay.com",
  "nutshell-crm-review":          "https://www.nutshell.com",
  "less-annoying-crm-review":     "https://www.lessannoyingcrm.com",
  "agile-crm-review":             "https://www.agilecrm.com",
  "salesmate-review":             "https://salesmate.io",
  "folk-crm-review":              "https://www.folk.app",
};

export function getAffiliateUrl(slug: string): string | null {
  return AFFILIATE_URLS[slug] ?? null;
}
