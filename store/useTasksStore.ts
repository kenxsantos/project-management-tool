import { create } from "zustand";
import { arrayMove } from "@dnd-kit/sortable";

import { Task } from "@/interfaces";
import { toast } from "sonner";
import { createChangeLog, patchTask } from "@/services/api";

type TasksState = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
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

  setTasks: (tasks) => set({ tasks }),

  moveTaskWithinColumn: (status, activeId, overId) => {
    const tasks = get().tasks;
    const columnTasks = tasks.filter((t) => t.status === status);

    const oldIndex = columnTasks.findIndex((t) => String(t.id) === activeId);
    const newIndex = columnTasks.findIndex((t) => String(t.id) === overId);

    const newColumnTasks = arrayMove(columnTasks, oldIndex, newIndex);
    const otherTasks = tasks.filter((t) => t.status !== status);

    set({ tasks: [...otherTasks, ...newColumnTasks] });
  },

  moveTaskToColumn: (activeTask, overTask) => {
    const tasks = get().tasks;
    const newStatus = overTask.status;

    const withoutActive = tasks.filter(
      (t) => String(t.id) !== String(activeTask.id)
    );
    const targetColumnTasks = withoutActive.filter(
      (t) => t.status === newStatus
    );

    const overIndex = targetColumnTasks.findIndex(
      (t) => String(t.id) === String(overTask.id)
    );

    targetColumnTasks.splice(overIndex, 0, {
      ...activeTask,
      status: newStatus,
    });
    const otherTasks = withoutActive.filter((t) => t.status !== newStatus);

    set({ tasks: [...otherTasks, ...targetColumnTasks] });
  },

  updateTaskStatus: async (activeTask, newStatus) => {
    try {
      const oldTask = get().tasks.find(
        (t) => String(t.id) === String(activeTask.id)
      );
      const oldStatus = oldTask ? oldTask.status : null;
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === activeTask.id ? { ...t, status: newStatus } : t
        ),
      }));

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
      toast.error("Failed to update task");
    }
  },
}));
