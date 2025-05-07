// ReviewsFetcher.ts
import type { Review } from "@/components/anime-reviews";

export async function ReviewsFetcher(animeId: string): Promise<Review[]> {
  if (!animeId) throw new Error("Anime ID is required");

  const res = await fetch(`/api/anime/animedetails/fetchreviews?animeid=${animeId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch reviews: ${res.statusText}`);
  }
  const data: Review[] = await res.json();
  console.log("Fetched Reviews:", data);
  return data;
}
