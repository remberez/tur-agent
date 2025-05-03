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
import HotelForm from './components/HotelsForm';
import CountryForm from './components/CountryAdminForm';
import CityForm from './components/CityAdminForm';
import TourTypeList from './components/TourTypeList';
import TourTypeForm from './components/TourTypeForm';
import ToursAdminPage from './components/ToursAdminPage';
import TourForm from './components/TourForm';
import ToursSearchPage from './components/ToursSearchPage';

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
            <Route path="cities/add" element={<CityForm/>} />
            <Route path="cities/edit/:id" element={<CityForm/>}/>

            <Route path="countries" element={<CountriesAdminPage />} />
            <Route path="countries/add" element={<CountryForm/>}/>
            <Route path="countries/edit/:id" element={<CountryForm/>}/>

            <Route path="employees" element={<EmployeesPage />} />
            <Route path="employees/add" element={<EmployeeForm />} />
            <Route path="employees/edit/:id" element={<EmployeeForm />} />

            <Route path="hotels" element={<HotelsAdminPage/>}/>
            <Route path="hotels/add" element={<HotelForm/>}/>
            <Route path="hotels/edit/:id" element={<HotelForm/>}/>

            <Route path="tour-types" element={<TourTypeList />} />
            <Route path="tour-types/add" element={<TourTypeForm />} />
            <Route path="tour-types/edit/:id" element={<TourTypeForm />} />

            <Route path="tours" element={<ToursAdminPage/>}/>
            <Route path="tours/add" element={<TourForm/>}/>
            <Route path="tours/edit/:id" element={<TourForm/>}/>

          </Route>
          <Route path="search" element={<ToursSearchPage/>}/>
        </Route>
      </Routes>
  );
});

export default App;