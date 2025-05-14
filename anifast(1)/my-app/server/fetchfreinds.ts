
export interface Friends {
    
        UserID: number,
        Username: string,
        PfpNum: number,
        STATUS: string
       
  }
  
  export async function FriendsFetcher(email: string): Promise<Friends[]> {
    
    
    const res = await fetch(`/api/friends?userEmail=${email}`, {
     
    });
  
    if (!res.ok) {
      throw new Error(`Failed to fetch anime: ${res.statusText}`);
    }
  
    const data: Friends[] = await res.json();
    return data;
  }