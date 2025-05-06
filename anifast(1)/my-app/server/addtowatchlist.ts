export async function handleAddToWatchlist(animeId: string,userEmail:string) {

    try {
      const response = await fetch("/api/anime/animedetails/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ animeId,userEmail}),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
  
      alert("Added to Watchlist!");
    } catch (error) {
      console.error("Failed to add to watchlist:", error);
    }
  }
  