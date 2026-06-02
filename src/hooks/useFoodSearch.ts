import { useState, useRef, useEffect } from 'react';
import { fatSecretService, FatSecretFood } from '../services/fatsecretService';

export const useFoodSearch = (debounceTime = 500) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FatSecretFood[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const search = (searchQuery: string) => {
    setQuery(searchQuery);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (searchQuery.length < 3) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    setShowResults(true);

    timeoutRef.current = setTimeout(async () => {
      const searchResults = await fatSecretService.search(searchQuery);
      setResults(searchResults);
      setIsSearching(false);
    }, debounceTime);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return {
    query,
    results,
    isSearching,
    showResults,
    setShowResults,
    search,
    clearSearch,
  };
};
