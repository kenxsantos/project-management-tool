import { useEffect, useState } from "react";
import { getAllUserProjects } from "@/services/api";
import { useProjectsStore } from "@/store/useProjectsStore";

export const useUserProjects = () => {
  const { projects, setProjects } = useProjectsStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (projects.length > 0) return;
      setLoading(true);
      try {
        const data = await getAllUserProjects();
        setProjects(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [projects.length, setProjects]);

  return { projects, loading, error };
};
