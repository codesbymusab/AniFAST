
  export async function UserFetcher(email:string , password: string){
    console.log('fetching user');
    const res = await fetch(`/api/user?email=${email}&passwordHash=${password}`, {
      cache: "no-store", // Ensure fresh data
    });
  
    if (!res.ok) {
      throw new Error(`Failed to fetch anime: ${res.statusText}`);
    }
  
    const data = await res.json();
    return data;
  }
  