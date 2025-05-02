import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { countryService } from '../services/countryService'; // Импортируем сервис для работы с странами

const CountriesAdminPage = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await countryService.getCountries();
        setCountries(response);
      } catch (err) {
        setError('Ошибка при загрузке стран');
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleDelete = async (id) => {
    try {
      await countryService.deleteCountry(id);
      setCountries(countries.filter((country) => country.id !== id)); // Удаляем страну из списка
    } catch (err) {
      setError('Ошибка при удалении страны');
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/countries/edit/${id}`); // Перенаправляем на страницу редактирования
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Страны</h2>
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
              {countries.map((country) => (
                <tr key={country.id}>
                  <td className="border px-4 py-2">{country.id}</td>
                  <td className="border px-4 py-2">{country.name}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEdit(country.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleDelete(country.id)}
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

export default CountriesAdminPage;
