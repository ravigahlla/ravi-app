const API_URL = 'http://localhost:5001/api';

export const api = {
  async getTasks(userId) {
    console.log('Fetching tasks for user:', userId);
    const response = await fetch(`${API_URL}/tasks/${userId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to fetch tasks: ${error}`);
    }
    return response.json();
  },

  async getProjects(userId) {
    console.log('Fetching projects for user:', userId);
    const response = await fetch(`${API_URL}/projects/${userId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to fetch projects: ${error}`);
    }
    return response.json();
  },

  async createProject(projectData) {
    const response = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create project: ${error}`);
    }
    return response.json();
  },

  async updateProject(projectId, updates) {
    const response = await fetch(`${API_URL}/projects/${projectId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to update project: ${error}`);
    }
    return response.json();
  },

  async createTask(taskData) {
    console.log('Sending task data:', taskData);
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    console.log('Response status:', response.status);
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create task: ${error}`);
    }
    return response.json();
  },

  async updateTask(taskId, updates) {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update task');
    return response.json();
  },

  async deleteTask(taskId) {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to delete task: ${error}`);
    }
    return response.json();
  },

  async deleteProject(projectId) {
    const response = await fetch(`${API_URL}/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to delete project: ${error}`);
    }
    return response.json();
  }
}; 