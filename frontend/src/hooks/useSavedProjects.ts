import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "skillbridge_saved_projects";

const getSavedIds = (): string[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed)
      ? parsed.map((id) => String(id))
      : [];
  } catch {
    return [];
  }
};

const useSavedProjects = () => {
  const [savedProjectIds, setSavedProjectIds] = useState<string[]>(
    getSavedIds
  );

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(savedProjectIds)
    );
  }, [savedProjectIds]);

  const isSaved = useCallback(
    (projectId: number | string) => {
      return savedProjectIds.includes(String(projectId));
    },
    [savedProjectIds]
  );

  const toggleSaved = useCallback(
    (projectId: number | string) => {
      const id = String(projectId);

      setSavedProjectIds((current) => {
        if (current.includes(id)) {
          return current.filter((savedId) => savedId !== id);
        }

        return [...current, id];
      });
    },
    []
  );

  const removeSaved = useCallback((projectId: number | string) => {
    const id = String(projectId);

    setSavedProjectIds((current) =>
      current.filter((savedId) => savedId !== id)
    );
  }, []);

  return {
    savedProjectIds,
    isSaved,
    toggleSaved,
    removeSaved,
  };
};

export default useSavedProjects;