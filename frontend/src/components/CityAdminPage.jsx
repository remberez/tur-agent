import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cityService } from '../services/cityService'; // Импортируем сервис для работы с городами

const CitiesAdminPage = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await cityService.getCities();
        setCities(response);
      } catch (err) {
        setError('Ошибка при загрузке городов');
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  const handleDelete = async (id) => {
    try {
      await cityService.deleteCity(id);
      setCities(cities.filter((city) => city.id !== id)); // Удаляем город из списка
    } catch (err) {
      setError('Ошибка при удалении города');
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/cities/edit/${id}`); // Перенаправляем на страницу редактирования
  };

  const handleAdd = () => {
    navigate("/admin/cities/add")
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Города</h2>
      <button
        onClick={handleAdd}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Добавить город
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
                <th className="px-4 py-2">Страна</th>
                <th className="px-4 py-2">Действия</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((city) => (
                <tr key={city.id}>
                  <td className="border px-4 py-2">{city.id}</td>
                  <td className="border px-4 py-2">{city.name}</td>
                  <td className="border px-4 py-2">{city.country?.name}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEdit(city.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleDelete(city.id)}
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

export default CitiesAdminPage;
