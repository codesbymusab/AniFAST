import type { Review } from "@/components/anime-reviews";

export async function postReview(review: Review): Promise<any> {
  try {
    const response = await fetch("/api/postreview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }

    const reviewData = await response.json();
    return reviewData;
  } catch (error) {
    console.error("Error posting review:", error);
    throw error;
  }
}
