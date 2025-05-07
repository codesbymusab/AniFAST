
export interface AnimeItem {
  AnimeID: number;
  Title: string;
  Episodes: number;
  Status: string;
  Rating: number;
  CoverImage: string;
  
}

export async function AnimeFetcher(property: string, count: number): Promise<AnimeItem[]> {
  
  const res = await fetch(`/api/anime?filter=${property}&limit=${count}`, {
   
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch anime: ${res.statusText}`);
  }

  const data: AnimeItem[] = await res.json();
  return data;
}
