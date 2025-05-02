import api from './api';

export const cityService = {
    async getCities() {
      const response = await api.get('/cities');
      return response.data;
    },
  
    async createCity(cityData) {
      const response = await api.post('/cities', cityData);
      return response.data;
    },
  
    async updateCity(cityId, cityData) {
      const response = await api.put(`/cities/${cityId}`, cityData);
      return response.data;
    },
  
    async deleteCity(cityId) {
      const response = await api.delete(`/cities/${cityId}`);
      return response.data;
    },
};
  