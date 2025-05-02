import React from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-full p-4">
      <h2 className="text-2xl font-bold mb-8">Админка</h2>
      <ul>
        <li>
          <Link to="/admin/cities" className="block p-2 hover:bg-gray-700">Города</Link>
        </li>
        <li>
          <Link to="/admin/countries" className="block p-2 hover:bg-gray-700">Страны</Link>
        </li>
        <li>
          <Link to="/admin/employees" className="block p-2 hover:bg-gray-700">Сотрудники</Link>
        </li>
        <li>
          <Link to="/admin/hotels" className="block p-2 hover:bg-gray-700">Отели</Link>
        </li>
      </ul>
    </div>
  );
};

const AdminPage = () => {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPage;
