import React, { useEffect, useState } from 'react';
import CardDataStats from '../../components/CardDataStats';
import ChartOne from '../../components/Charts/ChartOne';

const ECommerce: React.FC = () => {
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalModules, setTotalModules] = useState(0);

  interface ModulePhase {
    phase: string;
    totalModules: number;
    color: string;
  }

  const [modulesByPhase, setModulesByPhase] = useState<ModulePhase[]>([]);
  const [projectProgress, setProjectProgress] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseProjects = await fetch('https://sistema-de-proyectos-de-software.onrender.com/dashboard/total-projects');
        const dataProjects = await responseProjects.json();
        setTotalProjects(dataProjects.totalProjects);

        const responseModules = await fetch('https://sistema-de-proyectos-de-software.onrender.com/dashboard/total-modules');
        const dataModules = await responseModules.json();
        setTotalModules(dataModules.totalModules);

        const responseModulesByPhase = await fetch('https://sistema-de-proyectos-de-software.onrender.com/dashboard/modules-by-phase');
        const dataModulesByPhase = await responseModulesByPhase.json();
        setModulesByPhase(dataModulesByPhase);

        const responseProjectProgress = await fetch('https://sistema-de-proyectos-de-software.onrender.com/dashboard/project-progress');
        const dataProjectProgress = await responseProjectProgress.json();
        setProjectProgress(dataProjectProgress);
      } catch (error) {
        console.error("Error al obtener los datos del dashboard:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-5 bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Sección de Métricas */}
      <div className="text-center mb-5">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Resumen de Proyectos</h2>
        <p className="text-gray-500 dark:text-gray-400">Un resumen rápido de las métricas clave de tus proyectos</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 2xl:gap-7">
        {/* Tarjeta para el total de proyectos */}
        <CardDataStats title="Total Proyecto" total={totalProjects.toString()} rate="2.3%" levelUp>
          <svg className="fill-primary dark:fill-white" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="10" fill="#3C50E0" />
          </svg>
        </CardDataStats>

        {/* Tarjeta para el total de módulos */}
        <CardDataStats title="Total Modulos" total={totalModules.toString()} rate="1.8%" levelUp>
          <svg className="fill-primary dark:fill-white" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="10" fill="#E07B3C" />
          </svg>
        </CardDataStats>

        {/* Tarjetas dinámicas para cada fase de módulos */}
        {modulesByPhase.map((phase, index) => (
          <CardDataStats
            key={index}
            title={`Modulos en ${phase.phase}`}
            total={phase.totalModules.toString()}
            rate="0%"
            levelUp={phase.totalModules > 0}
          >
            <svg className="fill-primary dark:fill-white" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="10" fill={phase.color} />
            </svg>
          </CardDataStats>
        ))}
      </div>

      {/* Gráficos */}
      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Distribución de Módulos por Fase</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-center col-span-1">
            <ChartOne />
          </div>
          <div className="flex flex-col justify-center items-start col-span-1 space-y-3">
            {modulesByPhase.map((phase, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span style={{ backgroundColor: phase.color }} className="inline-block h-4 w-4 rounded-full"></span>
                <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">{`${phase.phase}: ${phase.totalModules} modules`}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ECommerce;
