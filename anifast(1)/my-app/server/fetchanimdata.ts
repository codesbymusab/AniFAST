export interface AnimeDetails {
    AnimeID: number;
    Title: string;
    JapaneseTitle: string;
    Synopsis: string;
    CoverImage: string;
    Rating: number;
    Episodes: number;
    ReleaseDate: string;
    Status: string;
    Studio: string;
    Website: string;
    Genres: string; // Comma-separated genre names
    Tags: string; // Comma-separated tag names
  }
  
  export async function AnimeFetcher(animeid: string): Promise<AnimeDetails | null> {
    const res = await fetch(`/api/animedetails?animeid=${animeid}`);
  
    if (!res.ok) {
      if (res.status === 404) {
        console.warn("Anime not found");
        return null;
      }
      throw new Error(`Failed to fetch anime: ${res.statusText}`);
    }
  
    return await res.json();
  }
  