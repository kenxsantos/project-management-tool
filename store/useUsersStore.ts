import { User } from "@/interfaces";
import { create } from "zustand";

type UsersState = {
  users: User[];
  setUsers: (user: User[]) => void;
};

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
}));
