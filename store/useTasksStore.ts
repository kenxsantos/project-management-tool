import { create } from "zustand";
import { arrayMove } from "@dnd-kit/sortable";

import { Task } from "@/interfaces";
import { toast } from "sonner";
import { createChangeLog, patchTask } from "@/services/api";

type TasksState = {
  tasks: Task[];
  setTasks: (tasks: Task[] | ((prev: Task[]) => Task[])) => void;
  moveTaskWithinColumn: (
    status: string,
    activeId: string,
    overId: string
  ) => void;
  moveTaskToColumn: (activeTask: Task, overTask: Task) => void;
  updateTaskStatus: (activeTask: Task, newStatus: string) => Promise<void>;
};

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],

  setTasks: (updater) =>
    set((state) => ({
      tasks: typeof updater === "function" ? updater(state.tasks) : updater,
    })),

  moveTaskWithinColumn: (status, activeId, overId) => {
    const tasks = get().tasks;
    const columnTasks = tasks.filter((t) => t.status === status);

    const oldIndex = columnTasks.findIndex((t) => String(t.id) === activeId);
    const newIndex = columnTasks.findIndex((t) => String(t.id) === overId);

    const newColumnTasks = arrayMove(columnTasks, oldIndex, newIndex);
    const otherTasks = tasks.filter((t) => t.status !== status);

    set({ tasks: [...otherTasks, ...newColumnTasks] });
  },

  moveTaskToColumn: async (activeTask, overTask) => {
    const newStatus = overTask.status;
    await get().updateTaskStatus(activeTask, newStatus);
  },

  updateTaskStatus: async (activeTask, newStatus) => {
    const oldTasks = get().tasks;
    const oldStatus = activeTask.status;

    try {
      await patchTask(
        Number(activeTask.id),
        activeTask.name,
        newStatus,
        activeTask.contents
      );

      if (oldStatus && oldStatus !== newStatus) {
        await createChangeLog(
          Number(activeTask.id),
          oldStatus,
          newStatus,
          "Change Status"
        );
      }

      toast.success("Task Updated Successfully!", { position: "top-right" });
    } catch (err) {
      console.error("Failed to update task status", err);
      set({ tasks: oldTasks });
      toast.error("Failed to update task", { position: "top-right" });
    }
  },
}));
