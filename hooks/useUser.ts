import { useEffect, useState } from "react";
import { getCurrentUser } from "@/services/api";
import { useUsersStore } from "@/store/useUsersStore";

export const useUser = () => {
  const { users, setUsers } = useUsersStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (users.length > 0) return;
      setLoading(true);
      try {
        const data = await getCurrentUser();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [users.length, setUsers]);

  return { users, loading, error };
};
