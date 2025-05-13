import type { AnimeItem } from "./types";

type FetchType = "trending" | "popular" | "latest" | "search";

export async function AnimeFetcher(
  typeOrProperty: FetchType | string = "trending",
  limitOrCount: number = 29,
  query?: string
): Promise<AnimeItem[]> {
  try {
    let data: any[] = [];
    const standardTypes = ["trending", "popular", "latest", "search"];
    const isStandardType = standardTypes.includes(typeOrProperty);

    // First attempt: Try the primary endpoint
    let primaryEndpoint = "";
    if (isStandardType) {
      // Handle as type-based fetching
      const type = typeOrProperty as FetchType;
      switch (type) {
        case "trending": primaryEndpoint = "/api/trending"; break;
        case "popular": primaryEndpoint = "/api/popular"; break;
        case "latest": primaryEndpoint = "/api/latest"; break;
        case "search": primaryEndpoint = `/api/search?query=${encodeURIComponent(query || "")}`; break;
        default: primaryEndpoint = "/api/trending";
      }
    } else {
      // Handle as property-based fetching
      primaryEndpoint = `/api/anime?filter=${typeOrProperty}&limit=${limitOrCount}`;
    }

    console.log(`Fetching anime with primary endpoint: ${primaryEndpoint}`);
    try {
      const primaryResponse = await fetch(primaryEndpoint);
      if (primaryResponse.ok) {
        const primaryData = await primaryResponse.json();
        
        // Check if we got valid data
        if (primaryData && Array.isArray(primaryData) && primaryData.length > 0) {
          console.log(`Successfully fetched ${primaryData.length} items from primary endpoint`);
          data = primaryData;
        } else {
          console.log("Primary endpoint returned empty data, will try fallback");
        }
      }
    } catch (primaryError) {
      console.error("Error with primary endpoint:", primaryError);
    }

    // Second attempt: If primary failed or returned empty for "popular", try fallback
    if ((data.length === 0) && (typeOrProperty === "popular" || 
        (typeof typeOrProperty === 'string' && typeOrProperty.toLowerCase().includes('popular')))) {
      
      // Use the alternative endpoint format
      const fallbackEndpoint = isStandardType 
        ? `/api/anime?filter=popular&limit=${limitOrCount}` 
        : "/api/popular";
      
      console.log(`Trying fallback endpoint for popular: ${fallbackEndpoint}`);
      try {
        const fallbackResponse = await fetch(fallbackEndpoint);
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          if (fallbackData && Array.isArray(fallbackData) && fallbackData.length > 0) {
            console.log(`Successfully fetched ${fallbackData.length} items from fallback endpoint`);
            data = fallbackData;
          }
        }
      } catch (fallbackError) {
        console.error("Error with fallback endpoint:", fallbackError);
      }
    }

    // If we still don't have data, make one more attempt for all standard types
    if (data.length === 0 && isStandardType) {
      const lastResortEndpoint = `/api/anime?filter=${typeOrProperty}&limit=${limitOrCount}`;
      console.log(`Making final attempt with: ${lastResortEndpoint}`);
      
      try {
        const lastResortResponse = await fetch(lastResortEndpoint);
        if (lastResortResponse.ok) {
          const lastResortData = await lastResortResponse.json();
          if (lastResortData && Array.isArray(lastResortData) && lastResortData.length > 0) {
            console.log(`Successfully fetched ${lastResortData.length} items from last resort endpoint`);
            data = lastResortData;
          }
        }
      } catch (lastResortError) {
        console.error("Error with last resort endpoint:", lastResortError);
      }
    }

    // If we still have no data, return empty array
    if (data.length === 0) {
      console.warn(`Could not fetch any data for ${typeOrProperty}`);
      return [];
    }
    
    // Process data consistently regardless of which API pattern succeeded
    const formattedData = data.map((anime: any) => ({
      ...anime,
      // Ensure both original properties and AnimeCard-expected properties are set
      AnimeID: anime.AnimeID || anime.id || 0,
      id: anime.id || anime.AnimeID || 0,
      Title: anime.Title || anime.title || "",
      title: anime.title || anime.Title || "",
      Episodes: anime.Episodes || anime.episodes || 0,
      episodes: anime.episodes || anime.Episodes || 0,
      Status: anime.Status || anime.status || "",
      status: anime.status || anime.Status || "",
      Rating: anime.Rating || anime.score || 0,
      score: anime.score || anime.Rating || 0,
      CoverImage: anime.CoverImage || anime.image || "",
      image: anime.image || anime.CoverImage || `/placeholder.svg?height=225&width=150`,
    }));
    
    // Apply limit if specified
    return formattedData.slice(0, limitOrCount);
  } catch (error) {
    console.error("Error in AnimeFetcher:", error);
    return [];
  }
}