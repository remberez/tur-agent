import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { userStore } from './stores/userStore';
import MainPage from './components/MainPage';
import AdminPage from './components/AdminPage';
import CitiesAdminPage from './components/CityAdminPage';
import CountriesAdminPage from './components/CountriesAdminPage';
import EmployeesPage from './components/EmployeeAdminPage';
import EmployeeForm from './components/EmployeeAdminForm';
import HotelsAdminPage from './components/HotelsAdmiPage';
import HotelForm from './components/CountriesAdminFormPage';
import CountryForm from './components/CountryAdminForm';

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
          <Route index element={<MainPage/>} />
          <Route path="/admin" element={<AdminPage />}>

            <Route path="cities" element={<CitiesAdminPage/>} />

            <Route path="countries" element={<CountriesAdminPage />} />
            <Route path="countries/add" element={<CountryForm/>}/>

            <Route path="employees" element={<EmployeesPage />} />
            <Route path="employees/add" element={<EmployeeForm />} />
            <Route path="employees/edit/:id" element={<EmployeeForm />} />

            <Route path="hotels" element={<HotelsAdminPage/>}/>
            <Route path="hotels/add" element={<HotelForm/>}/>
          </Route>
        </Route>
      </Routes>
  );
});

export default App;