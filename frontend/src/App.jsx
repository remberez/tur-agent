import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { userStore } from './stores/userStore';

const App = observer(() => {
  useEffect(() => {
    userStore.init();
  }, []);

  if (userStore.isLoading) {
    return <div className="text-center mt-10">Загрузка...</div>;
  }

  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="profile" element={<div>Профиль</div>} />
          <Route index element={<div>Главная</div>} />
        </Route>
      </Routes>
  );
});

export default App;