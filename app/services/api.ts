import { ChangeLogs, Task } from "@/interfaces";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/proxy",
  withCredentials: true,
});

export const fetchAllMembers = async () => {
  const res = await api.get("/test01/get_all_member");
  return res.data.data || [];
};
export const createProject = async (
  userId: string,
  name: string,
  description: string
) => {
  return await api.post("/test02/create_project", {
    user_id: userId,
    name,
    description,
  });
};

export const fetchAllProjects = async () => {
  const res = await api.get("/test02/get_all_project");
  return res.data.data || [];
};

export const fetchProject = async (id: number) => {
  try {
    const res = await api.get(`/test02/get_project?id=${id}`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch project", err);
    return null;
  }
};

export const patchProject = async (
  id: number,
  name: string,
  description: string
) => {
  try {
    const res = await api.patch("/test02/patch_project", {
      id,
      name,
      description,
    });

    return res.data;
  } catch (err) {
    console.error("Failed to patch project", err);
    return null;
  }
};

export const createTask = async (
  project_id: number,
  name: string,
  status: string,
  contents: string
) => {
  return await api.post("/test03/create_task", {
    project_id,
    name,
    status,
    contents,
  });
};

export const fetchAllTasks = async () => {
  const res = await api.get("/test03/get_all_task");
  return res.data.data || [];
};

export const fetchProjectTasks = async (project_id: number, status: string) => {
  try {
    const tasks = await fetchAllTasks();
    return tasks.filter(
      (task: Task) => task.project_id === project_id && task.status === status
    );
  } catch (err) {
    console.error("Failed to fetch task", err);
    return null;
  }
};

export const patchTask = async (
  taskId: number,
  name: string,
  status: string,
  content: string
) => {
  try {
    const res = await api.patch("/test03/patch_task", {
      task_id: taskId,
      name,
      status,
      content,
    });

    return res.data;
  } catch (err) {
    console.error("Failed to patch task", err);
    return null;
  }
};

export const fetchAllChangeLog = async () => {
  const res = await api.get("/test04/get_all_change_log");
  return res.data.data || [];
};

export const fetchTasksLogs = async (task_id: number) => {
  try {
    const tasks = await fetchAllChangeLog();
    return tasks.filter((log: ChangeLogs) => log.task_id === task_id);
  } catch (err) {
    console.error("Failed to fetch task", err);
    return null;
  }
};

export default api;
