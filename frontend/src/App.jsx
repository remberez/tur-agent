import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<div>Добро пожаловать!</div>} />
        <Route path="login" element={<div>Страница входа</div>} />
        <Route path="profile" element={<div>Личный кабинет</div>} />
      </Route>
    </Routes>
  );
}

export default App;