import React, { useEffect, useState } from 'react';
import { Project } from './types';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(
    window.innerWidth <= 640,
  );
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [projectToUpdate, setProjectToUpdate] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'En progreso',
  });
  const projectsPerPage = 3;

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

  const createProject = async () => {
    try {
      const response = await fetch('http://localhost:3000/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const createdProject = await response.json();
      setProjects([...projects, createdProject]);
      setIsModalOpen(false);
      Swal.fire({
        icon: 'success',
        title: 'Proyecto creado',
        text: 'El proyecto ha sido creado exitosamente',
        confirmButtonColor: '#3085d6',
      });
      setNewProject({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'En progreso',
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear el proyecto',
        confirmButtonColor: '#d33',
      });
      console.error(err);
      setError('No se pudo crear el proyecto');
    }
  };

  const handleDelete = async (projectId: number) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://localhost:3000/projects/${projectId}`,
            {
              method: 'DELETE',
              headers: {
                Accept: '*/*',
              },
            },
          );
          if (response.ok) {
            Swal.fire('Eliminado', 'El proyecto ha sido eliminado.', 'success');
            fetchProjects();
          } else {
            throw new Error('Error al eliminar el proyecto');
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Error desconocido';
          Swal.fire('Error', errorMessage, 'error');
        }
      }
    });
  };

  const handleUpdate = (project: Project) => {
    setProjectToUpdate({
      ...project,
      startDate: new Date(project.startDate).toISOString().split('T')[0],
      endDate: new Date(project.endDate).toISOString().split('T')[0],
    });
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!projectToUpdate) return;
  
    const updatedProject = {
      name: projectToUpdate.name,
      description: projectToUpdate.description,
      startDate: projectToUpdate.startDate,
      endDate: projectToUpdate.endDate,
      status: projectToUpdate.status,
    };
  
    try {
      const response = await fetch(
        `http://localhost:3000/projects/${projectToUpdate.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
          },
          body: JSON.stringify(updatedProject),
        },
      );
      if (response.ok) {
        // Actualiza solo el proyecto modificado en el estado
        const updatedProjects = projects.map((project) =>
          project.id === projectToUpdate.id ? { ...project, ...updatedProject } : project
        );
        setProjects(updatedProjects);
  
        Swal.fire('Actualizado', 'El proyecto ha sido actualizado.', 'success');
        setIsUpdateModalOpen(false);
      } else {
        throw new Error('Error al actualizar el proyecto');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      Swal.fire('Error', errorMessage, 'error');
    }
  };
  
  useEffect(() => {
    fetchProjects();
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (projectToUpdate) {
      setProjectToUpdate((prev) => ({ ...prev, [name]: value }) as Project);
    } else {
      setNewProject((prevProject) => ({ ...prevProject, [name]: value }));
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
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none transition-transform duration-150"
            >
              Crear nuevo proyecto
            </button>
          </div>
      
          {/* Modal para crear proyecto */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Crear nuevo proyecto
                </h2>
                <form onSubmit={createProject}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nombre del proyecto"
                    value={newProject.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 mb-4"
                  />
                  <textarea
                    name="description"
                    placeholder="Descripción del proyecto"
                    value={newProject.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 mb-4"
                  />
                  <div className="flex space-x-4 mb-4">
                    <div className="w-1/2">
                      <label
                        htmlFor="newStartDate"
                        className="block text-gray-700 font-medium mb-1"
                      >
                        Fecha de Inicio
                      </label>
                      <input
                        type="date"
                        id="newStartDate"
                        name="startDate"
                        value={newProject.startDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                      />
                    </div>
                    <div className="w-1/2">
                      <label
                        htmlFor="newEndDate"
                        className="block text-gray-700 font-medium mb-1"
                      >
                        Fecha de Fin
                      </label>
                      <input
                        type="date"
                        id="newEndDate"
                        name="endDate"
                        value={newProject.endDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                      />
                    </div>
                  </div>
      
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Crear
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
      
          {/* Modal para actualizar proyecto */}
          {isUpdateModalOpen && projectToUpdate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Actualizar Proyecto
                </h2>
                <form onSubmit={handleUpdateSubmit}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nombre del proyecto"
                    value={projectToUpdate.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 mb-4"
                  />
                  <textarea
                    name="description"
                    placeholder="Descripción del proyecto"
                    value={projectToUpdate.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 mb-4"
                  />
                  <div className="flex space-x-4 mb-4">
                    <div className="w-1/2">
                      <label
                        htmlFor="startDate"
                        className="block text-gray-700 font-medium mb-1"
                      >
                        Fecha de Inicio
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={projectToUpdate.startDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                      />
                    </div>
                    <div className="w-1/2">
                      <label
                        htmlFor="endDate"
                        className="block text-gray-700 font-medium mb-1"
                      >
                        Fecha de Fin
                      </label>
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={projectToUpdate.endDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                      />
                    </div>
                  </div>
      
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsUpdateModalOpen(false)}
                      className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Actualizar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
      
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {selectedProjects.map((project) => (
              <div
                key={project.id}
                className="relative border border-gray-200 rounded-lg p-6 shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 min-h-54"
              >
                <span className="absolute top-1 right-1 bg-blue-100 text-blue-700 font-semibold text-xs px-3 py-1 rounded-full shadow-md">
                  {project.status}
                </span>
      
                <Link to={`/projects/${project.id}`} className="block">
                  <h2 className="font-semibold text-xl text-blue-700 mb-2 mt-3">
                    {project.name}
                  </h2>
                  <p className="text-gray-700 mb-4 overflow-auto max-h-16">
                    {project.description}
                  </p>
                </Link>
      
                <div className="absolute bottom-4 left-4 right-4 bg-gray-100 p-3 rounded-md text-sm text-gray-700 shadow-inner flex justify-between">
                  <div>
                    <span className="block font-semibold text-xs text-gray-500">
                      Fecha de Inicio
                    </span>
                    <span>{new Date(project.startDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-xs text-gray-500">
                      Fecha de Fin
                    </span>
                    <span>{new Date(project.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
      
                <div className="absolute top-2 left-2 flex space-x-2">
                  <button
                    onClick={() => handleUpdate(project)}
                    className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Actualizar
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
      
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
