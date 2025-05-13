// Base anime item from the database
export interface AnimeItem {
  AnimeID: number;
  Title: string;
  JapaneseTitle?: string;
  Synopsis?: string;
  CoverImage?: string;
  Episodes?: number;
  Status?: string;
  Rating?: number;
  ReleaseDate?: string;
  Type?: string;
  
  // Properties mapped for AnimeCard component
  id?: number;
  title?: string;
  image?: string;
  score?: number;
  episodes?: number;
  status?: string;
}