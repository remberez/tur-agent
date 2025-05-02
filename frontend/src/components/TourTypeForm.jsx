import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tourTypeService } from '../services/tourTypeService'; // Импортируем сервис для работы с типами туров

const TourTypeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tourType, setTourType] = useState({
    name: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchTourType = async () => {
        try {
          const data = await tourTypeService.getById(id);
          setTourType(data);
        } catch (err) {
          setError('Ошибка при загрузке типа тура');
        }
      };
      fetchTourType();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTourType((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (id) {
        await tourTypeService.update(id, tourType);
      } else {
        await tourTypeService.create(tourType);
      }
      navigate('/admin/tour-types');
    } catch (err) {
      setError('Ошибка при сохранении типа тура');
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        {id ? 'Редактировать тип тура' : 'Добавить тип тура'}
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Название</label>
          <input
            type="text"
            name="name"
            value={tourType.name}
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

export default TourTypeForm;
