import { sharedProjects } from '../shared/projects.mjs';

export const projectSeeds = [
  ...sharedProjects,
  {
    name: "Website Redesign",
    notes: "Q1 2024 major redesign project",
    color: "#ff6b6b",
    userId: "demo-user"
  },
  {
    name: "API Integration",
    notes: "Third-party API integration project",
    color: "#4dabf7",
    userId: "demo-user"
  }
]; 