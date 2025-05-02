import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tourTypeService } from '../services/tourTypeService'; // Импортируем сервис для работы с типами туров

const TourTypesAdminPage = () => {
  const navigate = useNavigate();
  const [tourTypes, setTourTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTourTypes = async () => {
      try {
        const data = await tourTypeService.getAll();
        setTourTypes(data);
      } catch (err) {
        setError('Ошибка при загрузке типов туров');
      } finally {
        setLoading(false);
      }
    };
    fetchTourTypes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await tourTypeService.delete(id);
      setTourTypes(tourTypes.filter((tourType) => tourType.id !== id));
    } catch (err) {
      setError('Ошибка при удалении типа тура');
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/tour-types/edit/${id}`); // Перенаправляем на страницу редактирования
  };

  const handleAdd = () => {
    navigate('/admin/tour-types/add'); // Перенаправляем на страницу добавления типа тура
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Типы туров</h2>
      <button
        onClick={handleAdd}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Добавить тип тура
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
                <th className="px-4 py-2">Действия</th>
              </tr>
            </thead>
            <tbody>
              {tourTypes.map((tourType) => (
                <tr key={tourType.id}>
                  <td className="border px-4 py-2">{tourType.id}</td>
                  <td className="border px-4 py-2">{tourType.name}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEdit(tourType.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleDelete(tourType.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md ml-2"
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

export default TourTypesAdminPage;
