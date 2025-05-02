import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hotelService } from '../services/hotelService';

const HotelsAdminPage = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await hotelService.getHotels();
        setHotels(response);
      } catch (err) {
        setError('Ошибка при загрузке сотрудников');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const handleDelete = async (id) => {
    try {
      await hotelService.deleteHotel(id);
      setHotels(hotels.filter((hotel) => hotel.id !== id));
    } catch (err) {
      setError('Ошибка при удалении сотрудника');
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/hotels/edit/${id}`); // Перенаправляем на страницу редактирования
  };

  const handleAdd = () => {
    navigate('/admin/hotels/add'); // Перенаправляем на страницу добавления сотрудника
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Отели</h2>
      <button
        onClick={handleAdd}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Добавить отель
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <div>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Название</th>
                <th className="px-4 py-2">Звезды</th>
                <th className="px-4 py-2">Город</th>
                <th className="px-4 py-2">Действия</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel) => (
                <tr key={hotel.id}>
                  <td className="border px-4 py-2">{hotel.id}</td>
                  <td className="border px-4 py-2">{hotel.name}</td>
                  <td className="border px-4 py-2">{hotel.stars}</td>
                  <td className="border px-4 py-2">{hotel.city_id}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEdit(hotel.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleDelete(hotel.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded ml-2"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HotelsAdminPage;
