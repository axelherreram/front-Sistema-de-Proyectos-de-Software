import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UpdateModuleModal from './modals/UpdateModuleModal';

interface Phase {
  id: number;
  name: string;
  color: string;
}

interface Module {
  id: number;
  name: string;
  description: string;
  projectId: number;
  phaseId: number;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  phase: Phase;
}

interface ProjectDetailData {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectDetailData | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newModule, setNewModule] = useState({
    name: '',
    description: '',
    phaseId: 1,
    startDate: '',
    endDate: '',
    status: 'Pendiente',
  });

  const fetchProjectDetail = async () => {
    try {
      const response = await fetch(
        `https://sistema-de-proyectos-de-software.onrender.com/projects/${projectId}`,
        {
          method: 'GET',
          headers: { Accept: 'application/json' },
        },
      );
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data: ProjectDetailData = await response.json();
      setProject(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async () => {
    try {
      const response = await fetch(
        `https://sistema-de-proyectos-de-software.onrender.com/modules/project/${projectId}`,
        {
          method: 'GET',
          headers: { Accept: 'application/json' },
        },
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        setModules(data);
      } else if (
        data.message ===
        'No se encontraron módulos para el proyecto especificado'
      ) {
        setModules([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };
  const handleOpenUpdateModal = (module: Module) => {
    setSelectedModule(module);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateModule = (updatedModule: Module) => {
    const updatedPhase =
      phases.find((phase) => phase.id === updatedModule.phaseId) ||
      updatedModule.phase;

    setModules((prevModules) =>
      prevModules.map((module) =>
        module.id === updatedModule.id
          ? { ...updatedModule, phase: updatedPhase } // Actualiza phase
          : module,
      ),
    );
    fetchProjectDetail();
    setIsUpdateModalOpen(false);
  };

  const fetchPhases = async () => {
    try {
      const response = await fetch('https://sistema-de-proyectos-de-software.onrender.com/phases', {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data: Phase[] = await response.json();
      setPhases(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  const handleCreateModule = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('https://sistema-de-proyectos-de-software.onrender.com/modules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newModule,
          projectId: Number(projectId),
        }),
      });
      if (!response.ok) throw new Error('Error al crear el módulo');

      // Mostrar mensaje de éxito
      Swal.fire({
        icon: 'success',
        title: 'Módulo creado',
        text: 'El módulo ha sido creado exitosamente',
        confirmButtonColor: '#3085d6',
      });

      setIsModalOpen(false);
      setNewModule({
        name: '',
        description: '',
        phaseId: 1,
        startDate: '',
        endDate: '',
        status: 'Pendiente',
      });
      await fetchModules();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear el módulo',
        confirmButtonColor: '#d33',
      });
      console.error('Error creando el módulo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  // Función para eliminar un módulo
  const deleteModule = async (moduleId: number) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás deshacer esta acción',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });

      if (result.isConfirmed) {
        const response = await fetch(
          `https://sistema-de-proyectos-de-software.onrender.com/modules/${moduleId}`,
          {
            method: 'DELETE',
            headers: { Accept: '*/*' },
          },
        );

        if (!response.ok) throw new Error('Error al eliminar el módulo');
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El módulo ha sido eliminado exitosamente',
        });
        await fetchModules();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el módulo',
      });
      console.error('Error eliminando el módulo:', error);
    }
  };
  useEffect(() => {
    fetchProjectDetail();
    fetchModules();
    fetchPhases();
  }, [projectId]);

  if (loading) return <p>Cargando proyecto...</p>;
  if (error) return <p>Error al cargar el proyecto: {error}</p>;

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'Completed':
        return 'green';
      case 'In Progress':
        return 'blue';
      case 'Pending':
        return 'orange';
      case 'Delayed':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <div className="w-full p-6 bg-white shadow-md rounded-lg">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-5 py-2 bg-blue-600 text-white font-medium rounded-md shadow-md hover:bg-blue-700 focus:outline-none transition-transform duration-200 ease-in-out transform hover:scale-105"
      >
        ← Ir Atrás
      </button>

      <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">
          {project?.name}
        </h1>
        <p className="text-gray-600 text-sm mb-4">{project?.description}</p>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-gray-700 mt-4 space-y-4 sm:space-y-0 sm:gap-6">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm text-gray-500">Estado:</span>
            <span
              className="px-3 py-1 text-xs font-semibold text-white rounded-full"
              style={{ backgroundColor: getStatusColor(project?.status) }}
            >
              {project?.status}
            </span>
          </div>
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-inner space-y-2">
            {/* Fecha de Inicio */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <svg
                className="w-5 h-5 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v11a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 00-1-1H6zm3 3V3h2v2H9zM4 9h12v7a1 1 0 01-1 1H5a1 1 0 01-1-1V9zm5 2a1 1 0 10-2 0 1 1 0 002 0zm6-1a1 1 0 011 1 1 1 0 01-1 1 1 1 0 010-2z"
                  clipRule="evenodd"
                />
              </svg>
              <p>
                <span className="font-semibold text-gray-700">
                  Fecha de Inicio:
                </span>{' '}
                <span className="text-gray-800">
                  {new Date(project?.startDate || '').toLocaleDateString(
                    'es-ES',
                    {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    },
                  )}
                </span>
              </p>
            </div>

            {/* Fecha de Fin */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <svg
                className="w-5 h-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v11a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 00-1-1H6zm3 3V3h2v2H9zM4 9h12v7a1 1 0 01-1 1H5a1 1 0 01-1-1V9zm5 2a1 1 0 10-2 0 1 1 0 002 0zm6-1a1 1 0 011 1 1 1 0 010-2z"
                  clipRule="evenodd"
                />
              </svg>
              <p>
                <span className="font-semibold text-gray-700">
                  Fecha de Fin:
                </span>{' '}
                <span className="text-gray-800">
                  {new Date(project?.endDate || '').toLocaleDateString(
                    'es-ES',
                    {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    },
                  )}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-800">Módulos</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none transition-transform duration-150"
        >
          Crear nuevo módulo
        </button>
      </div>

      {/* Modal para crear módulo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Crear nuevo módulo
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateModule();
              }}
            >
              <input
                type="text"
                placeholder="Nombre del módulo"
                value={newModule.name}
                onChange={(e) =>
                  setNewModule({ ...newModule, name: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 mb-4"
                required
              />
              <textarea
                placeholder="Descripción del módulo"
                value={newModule.description}
                onChange={(e) =>
                  setNewModule({ ...newModule, description: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 mb-4"
                required
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
                    value={newModule.startDate}
                    onChange={(e) =>
                      setNewModule({ ...newModule, startDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    required
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
                    value={newModule.endDate}
                    onChange={(e) =>
                      setNewModule({ ...newModule, endDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="phase"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Fase
                </label>
                <select
                  id="phase"
                  value={newModule.phaseId}
                  onChange={(e) =>
                    setNewModule({
                      ...newModule,
                      phaseId: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  required
                >
                  {phases.map((phase) => (
                    <option key={phase.id} value={phase.id}>
                      {phase.name}
                    </option>
                  ))}
                </select>
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creando...' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modules.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          {modules.map((module) => (
            <div
              key={module.id}
              className="border border-gray-200 rounded-lg p-2 sm:p-6 shadow-sm bg-white hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
            >
              <div className="flex flex-wrap items-center justify-between mb-2 text-center lg:text-left">
                <h3 className="text-lg font-semibold text-blue-600 mr-2 w-full sm:w-auto">
                  {module.name}
                </h3>
                <div className="flex items-center space-x-2 mt-2 lg:mt-0 justify-center w-full sm:w-auto">
                  <span
                    className="px-2 py-1 text-xs font-semibold text-white rounded-full"
                    style={{ backgroundColor: module.phase.color }}
                  >
                    {module.phase.name}
                  </span>
                  <span className="text-xs font-medium text-gray-600">
                    ({module.status})
                  </span>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{module.description}</p>

              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-inner">
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v11a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 00-1-1H6zm3 3V3h2v2H9zM4 9h12v7a1 1 0 01-1 1H5a1 1 0 01-1-1V9zm5 2a1 1 0 10-2 0 1 1 0 002 0zm6-1a1 1 0 011 1 1 1 0 010-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p>
                    <span className="font-semibold text-gray-700">
                      Fecha de Inicio:
                    </span>{' '}
                    <span className="text-gray-800">
                      {new Date(module.startDate).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v11a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 00-1-1H6zm3 3V3h2v2H9zM4 9h12v7a1 1 0 01-1 1H5a1 1 0 01-1-1V9zm5 2a1 1 0 10-2 0 1 1 0 002 0zm6-1a1 1 0 011 1 1 1 0 010-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p>
                    <span className="font-semibold text-gray-700">
                      Fecha de Fin:
                    </span>{' '}
                    <span className="text-gray-800">
                      {new Date(module.endDate).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </p>
                </div>
              </div>

              {/* Botones de acciones */}
              <div className="flex flex-col sm:flex-row justify-between mt-4 space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={() => deleteModule(module.id)}
                  className="w-full sm:w-auto py-2 px-4 text-white font-semibold bg-red-500 hover:bg-red-600 rounded-md shadow-sm transition-colors duration-200"
                >
                  Eliminar módulo
                </button>
                <button
                  onClick={() => handleOpenUpdateModal(module)}
                  className="w-full sm:w-auto py-2 px-4 text-white font-semibold bg-blue-500 hover:bg-blue-600 rounded-md shadow-sm transition-colors duration-200"
                >
                  Actualizar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-8">
          No se encontraron módulos para este proyecto.
        </p>
      )}

      {isUpdateModalOpen && selectedModule && (
        <UpdateModuleModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          moduleData={selectedModule}
          phases={phases}
          onUpdate={handleUpdateModule}
        />
      )}
    </div>
  );
};

export default ProjectDetail;
