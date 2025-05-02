import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tourService } from '../services/tourService';

const ToursAdminPage = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await tourService.getTours();
        setTours(data);
      } catch (err) {
        setError('Ошибка при загрузке туров');
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  const handleDelete = async (id) => {
    try {
      await tourService.deleteTour(id);
      setTours(tours.filter(t => t.id !== id));
    } catch (err) {
      setError('Ошибка при удалении тура');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Туры</h2>
      <button
        onClick={() => navigate('/admin/tours/add')}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Добавить тур
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Название</th>
              <th className="px-4 py-2">Тип</th>
              <th className="px-4 py-2">Отель</th>
              <th className="px-4 py-2">Транспорт</th>
              <th className="px-4 py-2">Цена</th>
              <th className="px-4 py-2">Действия</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => (
              <tr key={tour.id}>
                <td className="border px-4 py-2">{tour.id}</td>
                <td className="border px-4 py-2">{tour.name}</td>
                <td className="border px-4 py-2">{tour.tour_type?.name}</td>
                <td className="border px-4 py-2">{tour.hotel?.name}</td>
                <td className="border px-4 py-2">{tour.transport}</td>
                <td className="border px-4 py-2">{tour.base_price}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => navigate(`/admin/tours/edit/${tour.id}`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(tour.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded ml-2"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ToursAdminPage;
