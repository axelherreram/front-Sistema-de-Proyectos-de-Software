import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

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

interface UpdateModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleData: Module;
  phases: Phase[];
  onUpdate: (updatedModule: Module) => void;
}

const UpdateModuleModal: React.FC<UpdateModuleModalProps> = ({
  isOpen,
  onClose,
  moduleData,
  phases,
  onUpdate,
}) => {
  const [updatedModule, setUpdatedModule] = useState<Module>(moduleData);

  useEffect(() => {
    if (moduleData) {
      // Convertimos a fecha sin desfase de zona horaria
      const startDate = new Date(moduleData.startDate);
      const endDate = new Date(moduleData.endDate);
  
      // Aseguramos que solo se tome la fecha en formato YYYY-MM-DD
      const adjustedStartDate = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0];
      const adjustedEndDate = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0];
  
      setUpdatedModule({
        ...moduleData,
        startDate: adjustedStartDate,
        endDate: adjustedEndDate,
      });
    }
  }, [moduleData]);
  
  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `https://sistema-de-proyectos-de-software.onrender.com/modules/${moduleData.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedModule),
        },
      );

      if (!response.ok) throw new Error('Error al actualizar el módulo');
      Swal.fire({
        icon: 'success',
        title: 'Módulo actualizado',
        text: 'El módulo ha sido actualizado exitosamente',
      });

      onUpdate(updatedModule); // Enviar módulo actualizado al componente principal
      onClose(); // Cerrar modal
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el módulo',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Actualizar Módulo
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
        >
          <input
            type="text"
            placeholder="Nombre del módulo"
            value={updatedModule.name}
            onChange={(e) =>
              setUpdatedModule({ ...updatedModule, name: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 mb-4"
            required
          />
          <textarea
            placeholder="Descripción del módulo"
            value={updatedModule.description}
            onChange={(e) =>
              setUpdatedModule({
                ...updatedModule,
                description: e.target.value,
              })
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
                value={updatedModule.startDate}
                onChange={(e) =>
                  setUpdatedModule({
                    ...updatedModule,
                    startDate: e.target.value,
                  })
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
                value={updatedModule.endDate}
                onChange={(e) =>
                  setUpdatedModule({
                    ...updatedModule,
                    endDate: e.target.value,
                  })
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
              value={updatedModule.phaseId}
              onChange={(e) =>
                setUpdatedModule({
                  ...updatedModule,
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
              onClick={onClose}
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
  );
};

export default UpdateModuleModal;
