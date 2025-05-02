import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { countryService } from '../services/countryService';
import { cityService } from '../services/cityService';
import { hotelService } from '../services/hotelService';

const HotelForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [cities, setCities] = useState([]);

  const [hotel, setHotel] = useState({
    name: "",
    stars: null,
    city_id: "",
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchHotel = async () => {
        try {
          const data = await hotelService.getHotel(id);
          setHotel(data);
        } catch (err) {
          setError('Ошибка при загрузке отеля');
        }
      };
      fetchHotel();
    }
  }, [id]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await cityService.getCities();
        setCities(data);
      } catch (error) {
        setError("Ошибка при загрузке городов");
      }
    }
    fetchCities();
  }, [])
  const handleChange = (e) => {
    const { name, value } = e.target;

    setHotel((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (id) {
        await hotelService.updateHotel(id, hotel);
      } else {
        await hotelService.createHotel(hotel);
      }
      navigate('/admin/hotels');
    } catch (err) {
      setError('Ошибка при сохранении отеля');
      console.error(err)
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        {id ? 'Редактировать отель' : 'Добавить отель'}
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Название</label>
          <input
            type="text"
            name="name"
            value={hotel.name}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Количество звёзд</label>
          <input
            type="number"
            name="stars"
            value={hotel.stars}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Город</label>
          <select
            name="city_id"
            value={hotel.city_id}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
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
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {id ? 'Обновить' : 'Создать'}
        </button>
      </form>
    </div>
  );
};

export default HotelForm;
