import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

interface Phase {
  id: number;
  name: string;
  color: string;
}

const PhasesComponent: React.FC = () => {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const [newColor, setNewColor] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPhase, setNewPhase] = useState({ name: '', color: '#000000' });

  const fetchPhases = async () => {
    try {
      const response = await fetch('https://sistema-de-proyectos-de-software.onrender.com/phases', {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const data: Phase[] = await response.json();
      setPhases(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUpdateColor = (phase: Phase) => {
    setSelectedPhase(phase);
    setNewColor(phase.color);
  };

  const updatePhaseColor = async () => {
    if (selectedPhase) {
      try {
        const response = await fetch(`https://sistema-de-proyectos-de-software.onrender.com/phases/${selectedPhase.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: selectedPhase.name,
            color: newColor,
          }),
        });

        if (!response.ok) throw new Error('Error al actualizar el color de la fase');

        Swal.fire({
          icon: 'success',
          title: 'Color actualizado',
          text: `El color de la fase ${selectedPhase.name} ha sido actualizado.`,
        });

        setPhases(phases.map(phase => 
          phase.id === selectedPhase.id ? { ...phase, color: newColor } : phase
        ));
        setSelectedPhase(null);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el color de la fase',
        });
      }
    }
  };

  const createNewPhase = async () => {
    try {
      const response = await fetch('https://sistema-de-proyectos-de-software.onrender.com/phases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPhase),
      });

      if (!response.ok) throw new Error('Error al crear la fase');

      const createdPhase = await response.json();
      setPhases([...phases, createdPhase]);

      Swal.fire({
        icon: 'success',
        title: 'Fase creada',
        text: `La fase ${createdPhase.name} ha sido creada exitosamente.`,
      });

      setNewPhase({ name: '', color: '#000000' });
      setIsCreateModalOpen(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear la fase',
      });
    }
  };

  useEffect(() => {
    fetchPhases();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Cargando fases...</p>;
  if (error) return <p className="text-center text-red-500">Error al cargar fases: {error}</p>;

  return (
    <div className="phases-container p-4 md:p-8 lg:p-12 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between flex-wrap mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Fases del Proyecto</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="mt-2 md:mt-0 py-2 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors duration-200"
          aria-label="Crear Nueva Fase"
        >
          Crear Nueva Fase
        </button>
      </div>

      <ul className="mt-6 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {phases.map((phase) => (
          <li
            key={phase.id}
            className="flex flex-col items-center p-4 rounded-lg shadow-lg bg-white border border-gray-200 text-center"
          >
            <div
              className="w-full h-4 rounded-t-lg"
              style={{ backgroundColor: phase.color }}
            ></div>

            <span className="mt-4 font-semibold text-gray-800 text-lg">{phase.name}</span>

            <div className="flex justify-center w-full space-x-2 mt-4">
              <button
                onClick={() => handleOpenUpdateColor(phase)}
                className="py-1 px-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 w-full"
                aria-label={`Actualizar color de ${phase.name}`}
              >
                Actualizar color
              </button>
            </div>
          </li>
        ))}
      </ul>

      {isCreateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Crear Nueva Fase</h3>
            <input
              type="text"
              placeholder="Nombre de la fase"
              value={newPhase.name}
              onChange={(e) => setNewPhase({ ...newPhase, name: e.target.value })}
              className="w-full mb-4 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
            <label className="block mb-2 font-semibold text-gray-600">Color</label>
            <input
              type="color"
              value={newPhase.color}
              onChange={(e) => setNewPhase({ ...newPhase, color: e.target.value })}
              className="w-full h-12 mb-4 cursor-pointer rounded-md"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={createNewPhase}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de actualización de color */}
      {selectedPhase && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Actualizar color de {selectedPhase.name}</h3>
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="w-full h-12 mb-4 cursor-pointer rounded-md"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedPhase(null)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={updatePhaseColor}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Actualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhasesComponent;
