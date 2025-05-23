import api from './api';

export const tourService = {
  getTours: async (params) => {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value != null)
    );
  
    const response = await api.get(`/tours`, {
      params: filteredParams,
    });
    return response.data;
  },

  getTour: async (id) => {
    const response = await api.get(`/tours/${id}`);
    return response.data;
  },
  createTour: async (tour) => {
    const response = await api.post('/tours', tour);
    return response.data;
  },
  updateTour: async (id, tour) => {
    const response = await api.put(`/tours/${id}`, tour);
    return response.data;
  },
  deleteTour: async (id) => {
    const response = await api.delete(`/tours/${id}`);
    return response.data;
  },
};
