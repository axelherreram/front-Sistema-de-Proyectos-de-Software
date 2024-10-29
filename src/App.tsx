import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';

import ECommerce from './pages/Dashboard/ECommerce';

import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Alerts from './pages/UiElements/Alerts';
import DefaultLayout from './layout/DefaultLayout';

import ProyectoList from './app/ProjectList';
import ProjectDetail from './app/ProjectDetail';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="Dashboard" />
              <ECommerce />
            </>
          }
        />
        <Route
          path="/projects"
          element={
            <>
              <PageTitle title="Proyectos" />
              <ProyectoList />
            </>
          }
        />
        <Route path="/projects/:projectId"
        element={
          <>
            <PageTitle title="Detalle por proyecto" />
            <ProjectDetail />
          </>
        }
        />

        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Perfil" />
              <Profile />
            </>
          }
        />

        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Settings />
            </>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <>
              <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Alerts />
            </>
          }
        />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
