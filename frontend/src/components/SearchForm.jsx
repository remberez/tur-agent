import React, { useEffect, useState } from 'react';
import { cityService } from '../services/cityService';

const SearchForm = ({ onSearch }) => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await cityService.getCities();
        setCities(data);
      } catch (error) {
        console.error('Ошибка при загрузке городов:', error);
      }
    };

    fetchCities();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ cityId: selectedCity });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center text-blue-600">Поиск</h2>

      <div className="mb-4">
        <label className="block mb-1">Город</label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Выберите город</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Найти
      </button>
    </form>
  );
};

export default SearchForm;
