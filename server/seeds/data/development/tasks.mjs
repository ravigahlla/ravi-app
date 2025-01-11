import { sharedTasks } from '../shared/tasks.mjs';

export const taskSeeds = [
  ...sharedTasks,
  {
    name: "Design new homepage",
    notes: "Focus on user experience",
    column: "Now",
    isComplete: false,
    previousColumn: "Now",
    subTasks: ["Create wireframes", "Get feedback", "Implement design"]
  },
  {
    name: "Set up API endpoints",
    notes: "Document all endpoints",
    column: "Next",
    isComplete: false,
    previousColumn: "Next",
    subTasks: ["Define routes", "Implement authentication", "Write tests"]
  },
  {
    name: "Write documentation",
    notes: "Include setup instructions",
    column: "Later",
    isComplete: false,
    previousColumn: "Later",
    subTasks: []
  }
]; 