
export interface AnimeItem {
  AnimeID: number;
  Title: string;
  JapaneseTitle: string;
  Type: string;
  Episodes: number;
  Status: string;
  ReleaseDate: string;
  Synopsis: string;
  Rating: number;
  CoverImage: string;
  StudioID: number;
}

export async function AnimeFetcher(property: string, count: number): Promise<AnimeItem[]> {
  const res = await fetch(`/api/anime?filter=${property}&limit=${count}`, {
    cache: "no-store", // Ensure fresh data
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch anime: ${res.statusText}`);
  }

  const data: AnimeItem[] = await res.json();
  return data;
}
