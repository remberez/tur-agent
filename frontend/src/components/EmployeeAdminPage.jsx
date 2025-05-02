import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeService } from '../services/employeeService';

const EmployeesPage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await employeeService.getEmployees();
        setEmployees(response);
      } catch (err) {
        setError('Ошибка при загрузке сотрудников');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    try {
      await employeeService.deleteEmployee(id);
      setEmployees(employees.filter((employee) => employee.id !== id)); // Удаляем сотрудника из списка
    } catch (err) {
      setError('Ошибка при удалении сотрудника');
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/employees/edit/${id}`); // Перенаправляем на страницу редактирования
  };

  const handleAdd = () => {
    navigate('/admin/employees/add'); // Перенаправляем на страницу добавления сотрудника
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Сотрудники</h2>
      <button
        onClick={handleAdd}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Добавить сотрудника
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
                <th className="px-4 py-2">Позиция</th>
                <th className="px-4 py-2">Действия</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td className="border px-4 py-2">{employee.id}</td>
                  <td className="border px-4 py-2">{employee.position}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEdit(employee.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleDelete(employee.id)}
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

export default EmployeesPage;
