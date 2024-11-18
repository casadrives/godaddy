import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Location {
  place_name: string;
  center: [number, number];
}

interface UseLocationSearchProps {
  debounceMs?: number;
}

export function useLocationSearch({ debounceMs = 300 }: UseLocationSearchProps = {}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  
  // Debounce search term
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    const handler = setTimeout(() => {
      setDebouncedTerm(term);
    }, debounceMs);
    return () => clearTimeout(handler);
  }, [debounceMs]);

  // Query for location suggestions
  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['locationSearch', debouncedTerm],
    queryFn: async () => {
      if (!debouncedTerm) return [];
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(debouncedTerm)}.json`,
        {
          params: {
            access_token: import.meta.env.VITE_MAPBOX_TOKEN,
            country: 'lu',
            types: 'address,place,poi',
            limit: 5,
          },
        }
      );
      return response.data.features.map((feature: any) => ({
        place_name: feature.place_name,
        center: feature.center,
      }));
    },
    enabled: debouncedTerm.length > 2,
  });

  // Reverse geocoding
  const reverseGeocode = useCallback(async (coordinates: [number, number]) => {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json`,
      {
        params: {
          access_token: import.meta.env.VITE_MAPBOX_TOKEN,
          types: 'address',
          limit: 1,
        },
      }
    );
    return response.data.features[0]?.place_name;
  }, []);

  return {
    searchTerm,
    handleSearch,
    suggestions: suggestions || [],
    isLoading,
    reverseGeocode,
  };
}
