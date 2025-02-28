import { createContext, useContext, useState, useCallback } from "react";
import debounce from "lodash/debounce";
import { supabase } from "@/lib/supabase";

interface SearchResult {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
}

interface SearchContextType {
  searchQuery: string;
  searchResults: SearchResult[];
  isSearching: boolean;
  search: (query: string) => Promise<void>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchQuery(query);

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .ilike("name", `%${query}%`);

      if (error) {
        console.error("Search error:", error);
        throw error;
      }

      console.log("Search results:", data); // Debug log
      setSearchResults(data || []);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        searchResults,
        isSearching,
        search,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}