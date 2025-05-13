import { AnimeItem } from "./fetchanimes";
  
  export async function AnimeSearch(query: string): Promise<AnimeItem[]> {
    
    
    const res = await fetch(`/api/search?query=${query}`, {
     
    });
  
    if (!res.ok) {
      throw new Error(`Failed to fetch anime: ${res.statusText}`);
    }
  
    const data: AnimeItem[] = await res.json();
    return data;
  }