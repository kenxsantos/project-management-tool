import { useEffect, useState } from "react";
import { fetchProjectTasks } from "@/services/api";
import { useTasksStore } from "@/store/useTasksStore";

export const useTasks = (projectId: number) => {
  const { tasks, setTasks } = useTasksStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (tasks.length > 0) return;
      setLoading(true);
      try {
        const data = await fetchProjectTasks(projectId);
        setTasks(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [tasks.length, setTasks, projectId]);

  return { tasks, loading, error };
};
