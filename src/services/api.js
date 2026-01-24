import axios from 'axios';

const API_BASE_URL = 'https://hrms-lite-backend-kymg.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Employee APIs
export const employeeService = {
  create: async (data) => {
    const response = await apiClient.post('/employees', data);
    return response.data;
  },

  getAll: async () => {
    const response = await apiClient.get('/employees');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/employees/${id}`);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/employees/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/employees/${id}`);
    return response.data;
  },
};

// Attendance APIs
export const attendanceService = {
  mark: async (data) => {
    const response = await apiClient.post('/attendance', data);
    return response.data;
  },

  getByEmployee: async (employeeId, month) => {
    const response = await apiClient.get(`/attendance/employee/${employeeId}`, {
      params: { month },
    });
    return response.data;
  },

  getAll: async (date) => {
    const response = await apiClient.get('/attendance', {
      params: { date },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/attendance/${id}`);
    return response.data;
  },
};

export default apiClient;


