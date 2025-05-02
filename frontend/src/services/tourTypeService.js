import api from './api';

export const tourTypeService = {
  getAll: () => api.get('/tour-types/').then(res => res.data),
  getById: (id) => api.get(`/tour-types/${id}`).then(res => res.data),
  create: (data) => api.post('/tour-types/', data),
  update: (id, data) => api.put(`/tour-types/${id}`, data),
  delete: (id) => api.delete(`/tour-types/${id}`),
};
