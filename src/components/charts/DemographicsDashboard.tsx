import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DemographicsDashboardProps {
  populationData: {
    density: number;
    nationalVsExpat: { national: number; expat: number };
    genderDistribution: { male: number; female: number };
    ageGroups: {
      label: string;
      value: number;
    }[];
  };
  region: string;
}

const DemographicsDashboard: React.FC<DemographicsDashboardProps> = ({
  populationData,
  region,
}) => {
  // Data for nationality distribution chart
  const nationalityData = {
    labels: ['National', 'Expatriate'],
    datasets: [
      {
        data: [populationData.nationalVsExpat.national, populationData.nationalVsExpat.expat],
        backgroundColor: ['#4F46E5', '#10B981'],
        borderColor: ['#4338CA', '#059669'],
        borderWidth: 1,
      },
    ],
  };

  // Data for gender distribution chart
  const genderData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        data: [populationData.genderDistribution.male, populationData.genderDistribution.female],
        backgroundColor: ['#3B82F6', '#EC4899'],
        borderColor: ['#2563EB', '#DB2777'],
        borderWidth: 1,
      },
    ],
  };

  // Data for age groups chart
  const ageData = {
    labels: populationData.ageGroups.map(group => group.label),
    datasets: [
      {
        label: 'Population by Age Group',
        data: populationData.ageGroups.map(group => group.value),
        backgroundColor: '#8B5CF6',
        borderColor: '#7C3AED',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3">Demographics: {region}</h3>
      
      <div className="mb-4">
        <h4 className="text-md font-medium text-gray-700 mb-2">Population Density</h4>
        <div className="text-2xl font-bold text-blue-600">
          {populationData.density.toLocaleString()} <span className="text-sm font-normal text-gray-500">per km²</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="h-48">
          <h4 className="text-md font-medium text-gray-700 mb-2">Nationality Distribution</h4>
          <Doughnut data={nationalityData} options={chartOptions} />
        </div>
        
        <div className="h-48">
          <h4 className="text-md font-medium text-gray-700 mb-2">Gender Distribution</h4>
          <Doughnut data={genderData} options={chartOptions} />
        </div>
      </div>
      
      <div className="h-64">
        <h4 className="text-md font-medium text-gray-700 mb-2">Age Distribution</h4>
        <Bar data={ageData} options={chartOptions} />
      </div>
    </div>
  );
};

export default DemographicsDashboard;
