
import { useState, useEffect } from 'react';

export type ProjectItemCounts = {
  characters: number;
  ideas: number;
  locations: number;
};

export const useProjectStats = () => {
  const [counts, setCounts] = useState<ProjectItemCounts>({
    characters: 0,
    ideas: 0,
    locations: 0
  });

  // Load initial counts from localStorage
  useEffect(() => {
    const characterCount = localStorage.getItem('characterCount');
    const ideaCount = localStorage.getItem('ideaCount');
    const locationCount = localStorage.getItem('locationCount');
    
    setCounts({
      characters: characterCount ? parseInt(characterCount) : 0,
      ideas: ideaCount ? parseInt(ideaCount) : 0,
      locations: locationCount ? parseInt(locationCount) : 0
    });
  }, []);

  // Functions to update counts
  const updateCharacterCount = (count: number) => {
    localStorage.setItem('characterCount', count.toString());
    setCounts(prev => ({ ...prev, characters: count }));
    
    // Dispatch storage event for cross-component communication
    const event = new Event('storage');
    window.dispatchEvent(event);
  };

  const updateIdeaCount = (count: number) => {
    localStorage.setItem('ideaCount', count.toString());
    setCounts(prev => ({ ...prev, ideas: count }));
    
    const event = new Event('storage');
    window.dispatchEvent(event);
  };

  const updateLocationCount = (count: number) => {
    localStorage.setItem('locationCount', count.toString());
    setCounts(prev => ({ ...prev, locations: count }));
    
    const event = new Event('storage');
    window.dispatchEvent(event);
  };

  const incrementCharacterCount = () => {
    const newCount = counts.characters + 1;
    updateCharacterCount(newCount);
  };

  const incrementIdeaCount = () => {
    const newCount = counts.ideas + 1;
    updateIdeaCount(newCount);
  };

  const incrementLocationCount = () => {
    const newCount = counts.locations + 1;
    updateLocationCount(newCount);
  };

  return {
    counts,
    updateCharacterCount,
    updateIdeaCount,
    updateLocationCount,
    incrementCharacterCount,
    incrementIdeaCount,
    incrementLocationCount
  };
};
