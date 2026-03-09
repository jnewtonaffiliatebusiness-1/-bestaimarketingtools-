const fs = require("fs");
const path = require("path");

const REVIEWS_DIR = path.join(__dirname, "../content/reviews");

const files = fs.readdirSync(REVIEWS_DIR).filter((f) => f.endsWith(".mdx"));

let updated = 0;
for (const file of files) {
  const slug = file.replace(".mdx", "");
  const filePath = path.join(REVIEWS_DIR, file);
  let content = fs.readFileSync(filePath, "utf-8");

  // Replace any affiliateUrl value with the /go/[slug] route
  const newContent = content.replace(
    /affiliateUrl:\s*"[^"]*"/,
    `affiliateUrl: "/go/${slug}"`
  );

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, "utf-8");
    updated++;
  }
}

console.log(`Updated ${updated}/${files.length} MDX files.`);
