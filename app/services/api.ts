import { ChangeLogs, Task } from "@/interfaces";
import axios from "axios";

const api = axios.create({
  baseURL: "/api/proxy",
  withCredentials: true,
});

export const signInUser = async (user_id: string, password: string) => {
  const data = await api.post(
    "/testlogin",
    { user_id, password },
    { withCredentials: true }
  );
  return data;
};

export const signUpUser = async (
  user_id: string,
  email: string,
  password: string
) => {
  const data = await api.post(
    "/test01/create_member",
    {
      user_id,
      email,
      password,
    },
    { withCredentials: true }
  );
  return data;
};

export const fetchAllMembers = async () => {
  const res = await api.get("/test01/get_all_member");
  return res.data.data;
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
  return res.data.data;
};

export const fetchProject = async (id: number) => {
  const res = await api.get(`/test02/get_project?id=${id}`);
  return res.data;
};

export const patchProject = async (
  id: number,
  name: string,
  description: string
) => {
  const res = await api.patch("/test02/patch_project", {
    id,
    name,
    description,
  });
  return res.data;
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
  return res.data.data;
};

export const fetchProjectTasks = async (project_id: number, status: string) => {
  const tasks = await fetchAllTasks();
  return tasks.filter(
    (task: Task) => task.project_id === project_id && task.status === status
  );
};

export const patchTask = async (
  taskId: number,
  name: string,
  status: string,
  contents: string
) => {
  const res = await api.patch("/test03/patch_task", {
    task_id: taskId,
    name,
    status,
    contents,
  });
  return res.data;
};

export const fetchAllChangeLog = async () => {
  const res = await api.get("/test04/get_all_change_log");
  return res.data.data;
};

export const fetchTasksLogs = async (task_id: number) => {
  const tasks = await fetchAllChangeLog();
  return tasks.filter((log: ChangeLogs) => log.task_id === task_id);
};

export const createChangeLog = async (
  task_id: number,
  old_status: string,
  new_status: string,
  remark: string
) => {
  const res = await api.post("/test04/create_changelog", {
    task_id,
    old_status,
    new_status,
    remark,
  });
  return res.data;
};

export default api;
