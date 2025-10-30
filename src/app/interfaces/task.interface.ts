export interface Task {
    taskName: string;
    scriptName: string;
    status: string; // Include the status property in the Task interface
    args?: string[]; // Include the args property in the Task interface
  }