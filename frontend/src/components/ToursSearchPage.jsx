import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cityService } from '../services/cityService';
import { tourService } from '../services/tourService';

const ToursSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cities, setCities] = useState([]);
  const [tours, setTours] = useState([]);
  const [error, setError] = useState('');

  const cityId = searchParams.get('city_id');

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await cityService.getCities();
        setCities(data);
      } catch {
        setError('Ошибка при загрузке городов');
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await tourService.getTours({ city_id: cityId });
        setTours(data);
      } catch (error) {
        setError('Ошибка при загрузке туров');
        console.error(error)
      }
    };
    fetchTours();
  }, [cityId]);

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setSearchParams(selectedCity ? { city_id: selectedCity } : {});
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Поиск туров</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4">
        <label className="block mb-1">Фильтр по городу</label>
        <select
          value={cityId || ''}
          onChange={handleCityChange}
          className="w-full border rounded-md p-2"
        >
          <option value="">Все города</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {tours.length === 0 ? (
        <p>Нет туров</p>
      ) : (
        <ul className="space-y-4">
          {tours.map((tour) => (
            <li key={tour.id} className="border rounded-md p-4">
              <h3 className="text-xl font-semibold">{tour.name}</h3>
              <p>{tour.description}</p>
              <p className="text-sm text-gray-600">
                Город: {tour.hotel?.city?.name}, Отель: {tour.hotel?.name}
              </p>
              <p className="text-sm">Цена: {tour.base_price} ₽</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ToursSearchPage;
