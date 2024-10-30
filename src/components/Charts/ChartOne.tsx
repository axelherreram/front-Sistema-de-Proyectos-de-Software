import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';


const options: ApexOptions = {
  chart: {
    type: 'bar',
    height: '100%', 
    width: '100%', 
    toolbar: {
      show: false, 
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      distributed: true,
      barHeight: '70%',
    },
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: '10px', 
    },
    formatter: function (val) {
      return val.toString();
    },
  },
  xaxis: {
    categories: [],
    min: 0,
    max: 10, 
    tickAmount: 5,
    labels: {
      style: {
        fontSize: '12px',
      },
      formatter: function (val) {
        return Number(val).toFixed(0); 
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        fontSize: '10px', 
      },
    },
    title: {
      text: 'Fases',
      style: {
        fontSize: '14px', 
      },
    },
  },
  title: {
    text: 'Distribución de Módulos por Fase',
    align: 'center',
    style: {
      fontSize: '16px',
      fontWeight: 'bold',
    },
  },
  grid: {
    padding: {
      left: 10,
      right: 10,
      top: 20,
      bottom: 10,
    },
  },
  responsive: [
    {
      breakpoint: 768,
      options: {
        plotOptions: {
          bar: {
            barHeight: '60%', 
          },
        },
        dataLabels: {
          style: {
            fontSize: '8px', 
          },
        },
        xaxis: {
          labels: {
            style: {
              fontSize: '8px',
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              fontSize: '8px',
            },
          },
        },
      },
    },
  ],
};

const ChartModulesByPhase: React.FC = () => {
  const [series, setSeries] = useState([{ name: 'Total de Módulos', data: [] }]);
  const [categories, setCategories] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://sistema-de-proyectos-de-software.onrender.com/dashboard/modules-by-phase');
        const data = await response.json();
        
        const phaseNames = data.map((item: any) => item.phase);
        const totalModules = data.map((item: any) => item.totalModules);
        const phaseColors = data.map((item: any) => item.color);
  
        setSeries([{ name: 'Total de Módulos', data: totalModules }]);
        setCategories(phaseNames);
        setColors(phaseColors);
      } catch (error) {
        console.error("Error al obtener los datos de la API:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="rounded-md shadow-lg p-5 bg-white dark:bg-gray-800 w-full max-w-screen-lg mx-auto" style={{ height: '100%', minHeight: '400px' }}>
      <ReactApexChart
        options={{
          ...options,
          colors: colors, 
          xaxis: { ...options.xaxis, categories: categories }, // Categorías desde la API
        }}
        series={series}
        type="bar"
        height="100%" // Configuración de altura al 100%
      />
    </div>
  );
};

export default ChartModulesByPhase;
