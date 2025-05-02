import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { employeeService } from '../services/employeeService'; // Импортируем сервис для работы с сотрудниками

const EmployeeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Получаем ID сотрудника, если редактируем
  const [employee, setEmployee] = useState({
    position: '',
    user_id: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      // Если есть id, загружаем данные сотрудника
      const fetchEmployee = async () => {
        try {
          const response = await employeeService.getEmployee(id);
          setEmployee(response);
        } catch (err) {
          setError('Ошибка при загрузке сотрудника');
        }
      };

      fetchEmployee();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (id) {
        // Если id есть, обновляем сотрудника
        await employeeService.updateEmployee(id, employee);
      } else {
        // Если id нет, создаем нового сотрудника
        await employeeService.createEmployee(employee);
      }
      navigate('/admin/employees'); // Перенаправляем обратно на страницу сотрудников
    } catch (err) {
      setError('Ошибка при сохранении данных сотрудника');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        {id ? 'Редактировать сотрудника' : 'Добавить сотрудника'}
      </h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Позиция</label>
          <select
            name="position"
            value={employee.position}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          >
            <option value="">Выберите позицию</option>
            <option value="admin">Админ</option>
            <option value="moderator">Модератор</option>
            <option value="employee">Сотрудник</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">ID пользователя</label>
          <input
            type="text"
            name="user_id"
            value={employee.user_id}
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

export default EmployeeForm;
