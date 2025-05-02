import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tourService } from '../services/tourService';
import { tourTypeService } from '../services/tourTypeService';
import { hotelService } from '../services/hotelService';

const TourForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tour, setTour] = useState({
    name: '',
    description: '',
    tour_type_id: '',
    hotel_id: '',
    transport: '',
    base_price: ''
  });

  const [tourTypes, setTourTypes] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      tourService.getTour(id)
        .then(setTour)
        .catch(() => setError('Ошибка при загрузке тура'));
    }
  }, [id]);

  useEffect(() => {
    tourTypeService.getAll()
      .then(setTourTypes)
      .catch(() => setError('Ошибка при загрузке типов туров'));

    hotelService.getHotels()
      .then(setHotels)
      .catch(() => setError('Ошибка при загрузке отелей'));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTour((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (id) {
        await tourService.updateTour(id, tour);
      } else {
        await tourService.createTour(tour);
      }
      navigate('/admin/tours');
    } catch (error) {
      setError('Ошибка при сохранении тура');
      console.log(error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{id ? 'Редактировать тур' : 'Добавить тур'}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Название</label>
          <input
            type="text"
            name="name"
            value={tour.name}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Описание</label>
          <textarea
            name="description"
            value={tour.description}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Тип тура</label>
          <select
            name="tour_type_id"
            value={tour.tour_type_id}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          >
            <option value="">Выберите тип</option>
            {tourTypes.map(tt => (
              <option key={tt.id} value={tt.id}>{tt.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Отель</label>
          <select
            name="hotel_id"
            value={tour.hotel_id}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          >
            <option value="">Выберите отель</option>
            {hotels.map(h => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Транспорт</label>
          <select
            name="transport"
            value={tour.transport}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          >
            <option value="">Выберите транспорт</option>
            <option value="Bus">Автобус</option>
            <option value="Ship">Самолёт</option>
            <option value="Train">Поезд</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Базовая цена</label>
          <input
            type="number"
            step="0.01"
            name="base_price"
            value={tour.base_price}
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

export default TourForm;
