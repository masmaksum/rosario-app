import { useState, useEffect } from 'react';

const KEY = 'rosario:starred_litani';

export function useStarredLitani() {
  const [starred, setStarred] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(starred));
  }, [starred]);

  const toggleStar = (id) => {
    setStarred((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return [starred, toggleStar];
}
