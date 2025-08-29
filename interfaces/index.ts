export interface Task {
  id: string;
  name: string;
  status: string;
  contents: string;
  project_id: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  user_id: string;
  created_at: string;
}

export interface ChangeLogs {
  id: number;
  task_id: number;
  old_status: string;
  new_status: string;
  remark: string;
  created_at: string;
}
