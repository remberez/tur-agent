import api from './api';

export const hotelService = {
  getHotels: async () => {
    const response = await api.get('/hotels');
    return response.data;
  },

  getHotel: async (id) => {
    const response = await api.get(`/hotels/${id}`);
    return response.data;
  },

  createHotel: async (data) => {
    const response = await api.post('/hotels', data);
    return response.data;
  },

  updateHotel: async (id, data) => {
    const response = await api.put(`/hotels/${id}`, data);
    return response.data;
  },

  deleteHotel: async (id) => {
    const response = await api.delete(`/hotels/${id}`);
    return response.data;
  },
};
