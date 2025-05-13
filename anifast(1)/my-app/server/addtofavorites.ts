import { useSession } from "next-auth/react";

export async function handleAddToFavorite(animeId: string,userEmail:string) {
        

    try {
      const response = await fetch("/api/anime/animedetails/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ animeId,userEmail}),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
  
      
    } catch (error) {
      console.error("Failed to add to favorites:", error);
    }
  }
  