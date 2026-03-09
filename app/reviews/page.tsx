import { getAllReviews } from "@/lib/reviews";
import ReviewsClient from "./ReviewsClient";

export const metadata = {
  title: "All Software Reviews — 100+ Honest Reviews",
  description:
    "Browse 100+ honest, unbiased reviews of AI marketing, email, SEO, social, and CRM tools. Filter by category, rating, or price.",
};

export default function ReviewsPage() {
  const reviews = getAllReviews();
  return <ReviewsClient reviews={reviews} />;
}
