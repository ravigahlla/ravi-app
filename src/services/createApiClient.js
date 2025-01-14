const API_URL = 'http://localhost:5001/api';

export function createApiClient(getToken) {
  return {
    async getTasks(userId) {
      console.log('🔄 Fetching tasks for user:', userId);
      const token = await getToken();
      const response = await fetch(`${API_URL}/tasks/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const error = await response.text();
        console.error('❌ API Error:', error);
        throw new Error(`Failed to fetch tasks: ${error}`);
      }
      const data = await response.json();
      console.log('✅ API Response:', data);
      return data;
    },

    async getProjects(userId) {
      console.log('🔄 Fetching projects for user:', userId);
      const token = await getToken();
      const response = await fetch(`${API_URL}/projects/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const error = await response.text();
        console.error('❌ API Error:', error);
        throw new Error(`Failed to fetch projects: ${error}`);
      }
      const data = await response.json();
      console.log('✅ API Response:', data);
      return data;
    }
    // ... other methods remain the same
  };
} 