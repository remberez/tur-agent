import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { countryService } from '../services/countryService';

const CountryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [country, setCountry] = useState({
    name: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchCountry = async () => {
        try {
          const data = await countryService.getCountry(id);
          setCountry(data);
        } catch (err) {
          setError('Ошибка при загрузке страны');
        }
      };

      fetchCountry();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCountry((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (id) {
        await countryService.updateCountry(id, country);
      } else {
        await countryService.createCountry(country);
      }
      navigate('/admin/countries');
    } catch (err) {
      setError('Ошибка при сохранении страны');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        {id ? 'Редактировать страну' : 'Добавить страну'}
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Название</label>
          <input
            type="text"
            name="name"
            value={country.name}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          />
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

export default CountryForm;
