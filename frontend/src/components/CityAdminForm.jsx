import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cityService } from '../services/cityService';
import { countryService } from '../services/countryService';

const CityForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [city, setCity] = useState({
    name: '',
    country_id: '',
  });

  const [countries, setCountries] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await countryService.getCountries();
        setCountries(data);
      } catch {
        setError('Ошибка при загрузке стран');
      }
    };

    fetchCountries();

    if (id) {
      const fetchCity = async () => {
        try {
          const data = await cityService.getCity(id);
          setCity(data);
        } catch {
          setError('Ошибка при загрузке города');
        }
      };

      fetchCity();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCity((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (id) {
        await cityService.updateCity(id, city);
      } else {
        await cityService.createCity(city);
      }
      navigate('/admin/cities');
    } catch {
      setError('Ошибка при сохранении города');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        {id ? 'Редактировать город' : 'Добавить город'}
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Название города</label>
          <input
            type="text"
            name="name"
            value={city.name}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Страна</label>
          <select
            name="country_id"
            value={city.country_id}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          >
            <option value="">Выберите страну</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {id ? 'Обновить' : 'Создать'}
        </button>
      </form>
    </div>
  );
};

export default CityForm;
