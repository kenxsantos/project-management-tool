export enum Status {
  Todo = "Todo",
  InProgress = "In Progress",
  Done = "Done",
}

export const StatusLabels: Record<Status, string> = {
  [Status.Todo]: "To Do",
  [Status.InProgress]: "In Progress",
  [Status.Done]: "Done",
};
