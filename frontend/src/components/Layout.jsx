import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { userStore } from '../stores/userStore';

const Layout = observer(() => {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50 text-gray-800">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-extrabold text-blue-600">Тур Агентство</Link>
          <nav className="space-x-4">
            {userStore.user ? (
              <Link
                to="/profile"
                className="text-blue-600 hover:underline transition"
              >
                Профиль
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-white bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-md"
              >
                Войти
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>

      <footer className="bg-white shadow-inner">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-500">
          © 2025 Тур Агентство. Все права защищены.
        </div>
      </footer>
    </div>
  );
});

export default Layout;
