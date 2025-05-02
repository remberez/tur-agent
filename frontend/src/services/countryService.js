import api from './api';

export const countryService = {
  async getCountries() {
    const response = await api.get('/countries');
    return response.data;
  },

  async createCountry(countryData) {
    const response = await api.post('/countries', countryData);
    return response.data;
  },

  async updateCountry(countryId, countryData) {
    const response = await api.put(`/countries/${countryId}`, countryData);
    return response.data;
  },

  async deleteCountry(countryId) {
    const response = await api.delete(`/countries/${countryId}`);
    return response.data;
  },

  async getCountry(countryId) {
    const response = await api.get(`/countries/${countryId}`);
    return response.data;
  }
};
