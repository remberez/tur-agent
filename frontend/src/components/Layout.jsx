import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { userStore } from '../stores/userStore';

const Layout = observer(() => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Закрытие меню при клике вне блока
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    userStore.logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50 text-gray-800">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-extrabold text-blue-600">
            Тур Агентство
          </Link>
          <nav className="relative" ref={menuRef}>
            {userStore.user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="text-blue-600 font-medium px-4 py-2 border rounded-md hover:bg-blue-50 transition"
                >
                  {userStore.user.full_name || 'Профиль'}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-md border z-50 overflow-hidden">
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Профиль
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Выйти
                    </button>
                  </div>
                )}
              </div>
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
