import { Project } from "@/interfaces";
import { create } from "zustand";

type ProjectsState = {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  getProjectById: (id: number) => Project | undefined;
};

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  setProjects: (projects) => set({ projects }),
  getProjectById: (id) =>
    get().projects.find((p) => String(p.id) === String(id)),
}));
