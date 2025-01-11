import { sharedTasks } from '../shared/tasks.mjs';

export const taskSeeds = [
  ...sharedTasks,
  {
    name: "Demo Task 1",
    notes: "This is a demo task",
    column: "Now",
    isComplete: false,
    previousColumn: "Now",
    subTasks: ["Subtask 1", "Subtask 2"]
  }
]; 