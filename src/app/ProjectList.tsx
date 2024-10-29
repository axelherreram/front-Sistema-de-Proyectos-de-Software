// ProjectList.tsx
import React, { useEffect, useState } from 'react';
import { Project } from './types';

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(
    window.innerWidth <= 640,
  ); // Verifica si es pantalla pequeña
  const projectsPerPage = 3;

  // Función para obtener proyectos desde la API
  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:3000/projects', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data: Project[] = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();

    // Actualiza `isSmallScreen` cuando la pantalla cambia de tamaño
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const selectedProjects = isSmallScreen
    ? projects.slice(startIndex, startIndex + projectsPerPage)
    : projects;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading)
    return (
      <p className="text-center text-lg font-medium text-gray-600">
        Cargando proyectos...
      </p>
    );
  if (error)
    return (
      <p className="text-center text-red-500 font-medium">
        Error al cargar proyectos: {error}
      </p>
    );

  return (
    <div className="project-list h-full w-full max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-800">Lista de Proyectos</h1>
        <button className="bg-blue-500 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none">
          Crear nuevo proyecto
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {selectedProjects.map((project) => (
          <div
            key={project.id}
            className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white"
          >
            <h2 className="font-semibold text-xl text-blue-600">
              {project.name}
            </h2>
            <p className="text-gray-700 mt-1">{project.description}</p>
            <div className="mt-2 text-sm text-gray-600">
              <p>
                <span className="font-semibold">Estado:</span> {project.status}
              </p>
              <p>
                <span className="font-semibold">Fecha de Inicio:</span>{' '}
                {new Date(project.startDate).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">Fecha de Fin:</span>{' '}
                {new Date(project.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Barra de navegación visible solo en dispositivos pequeños */}
      {isSmallScreen && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded border border-gray-300 text-blue-500 hover:bg-blue-100 disabled:opacity-50"
          >
            &larr;
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => goToPage(index + 1)}
              className={`px-3 py-1 rounded border border-gray-300 hover:bg-blue-100 ${
                currentPage === index + 1
                  ? 'bg-blue-500 text-white'
                  : 'text-blue-500'
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 rounded border border-gray-300 text-blue-500 hover:bg-blue-100 disabled:opacity-50"
          >
            &rarr;
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
