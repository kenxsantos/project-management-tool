import { useEffect, useState } from "react";
import { fetchProjectTasks } from "@/services/api";
import { useTasksStore } from "@/store/useTasksStore";

export const useTasks = (projectId: number) => {
  const { tasks, setTasks } = useTasksStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        setTasks([]);
        const data = await fetchProjectTasks(projectId);
        setTasks(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [projectId, setTasks]);

  return { tasks, loading, error };
};
