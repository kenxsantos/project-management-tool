import { Project } from "@/interfaces";
import { create } from "zustand";

type ProjectsState = {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  updateProject: (project: Project) => void;
};

export const useProjectsStore = create<ProjectsState>((set) => ({
  projects: [],
  setProjects: (projects) => set({ projects }),
  updateProject: (project) =>
    set((state) => ({
      projects: state.projects.map((p) => (p.id === project.id ? project : p)),
    })),
}));
