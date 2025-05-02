import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { userStore } from '../stores/userStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await authService.login(email, password);
      const user = await authService.getMe();

      userStore.setUser(user);
      navigate('/profile');
    } catch (err) {
      setError('Неверный email или пароль');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Вход</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm">Email</label>
          <input
            type="email"
            className="w-full border rounded-md p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">Пароль</label>
          <input
            type="password"
            className="w-full border rounded-md p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Войти
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
