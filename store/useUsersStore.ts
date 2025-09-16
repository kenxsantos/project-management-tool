import { User } from "@/types/user-data";
import { create } from "zustand";

type UsersState = {
  users: User[];
  setUsers: (user: User[]) => void;
};

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
}));
