import React, { useState } from 'react';

interface CancerDetectionFilterProps {
  onFilterChange: (filters: {
    cancerTypes: string[];
    ageGroups: string[];
    selectedArea?: string;
  }) => void;
  availableCancerTypes: string[];
  availableAgeGroups: string[];
  availableAreas: string[];
}

const CancerDetectionFilter: React.FC<CancerDetectionFilterProps> = ({
  onFilterChange,
  availableCancerTypes,
  availableAgeGroups,
  availableAreas,
}) => {
  const [selectedCancerTypes, setSelectedCancerTypes] = useState<string[]>([]);
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>('');

  const handleCancerTypeChange = (type: string) => {
    const updatedTypes = selectedCancerTypes.includes(type)
      ? selectedCancerTypes.filter(t => t !== type)
      : [...selectedCancerTypes, type];
    
    setSelectedCancerTypes(updatedTypes);
    onFilterChange({
      cancerTypes: updatedTypes,
      ageGroups: selectedAgeGroups,
      selectedArea: selectedArea || undefined
    });
  };

  const handleAgeGroupChange = (group: string) => {
    const updatedGroups = selectedAgeGroups.includes(group)
      ? selectedAgeGroups.filter(g => g !== group)
      : [...selectedAgeGroups, group];
    
    setSelectedAgeGroups(updatedGroups);
    onFilterChange({
      cancerTypes: selectedCancerTypes,
      ageGroups: updatedGroups,
      selectedArea: selectedArea || undefined
    });
  };

  const handleAreaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const area = event.target.value;
    setSelectedArea(area);
    onFilterChange({
      cancerTypes: selectedCancerTypes,
      ageGroups: selectedAgeGroups,
      selectedArea: area || undefined
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3">Early Cancer Detection Filters</h3>
      
      <div className="mb-4">
        <h4 className="text-md font-medium text-gray-700 mb-2">Select Area</h4>
        <select
          value={selectedArea}
          onChange={handleAreaChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Areas</option>
          {availableAreas.map(area => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <h4 className="text-md font-medium text-gray-700 mb-2">Cancer Types</h4>
        <div className="grid grid-cols-2 gap-2">
          {availableCancerTypes.map(type => (
            <div key={type} className="flex items-center">
              <input
                type="checkbox"
                id={`cancer-${type}`}
                checked={selectedCancerTypes.includes(type)}
                onChange={() => handleCancerTypeChange(type)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label
                htmlFor={`cancer-${type}`}
                className="ml-2 text-sm text-gray-700 cursor-pointer"
              >
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="text-md font-medium text-gray-700 mb-2">Age Groups</h4>
        <div className="grid grid-cols-2 gap-2">
          {availableAgeGroups.map(group => (
            <div key={group} className="flex items-center">
              <input
                type="checkbox"
                id={`age-${group}`}
                checked={selectedAgeGroups.includes(group)}
                onChange={() => handleAgeGroupChange(group)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label
                htmlFor={`age-${group}`}
                className="ml-2 text-sm text-gray-700 cursor-pointer"
              >
                {group}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
        <p className="text-sm text-blue-800">
          {selectedCancerTypes.length === 0 && selectedAgeGroups.length === 0 ? (
            "Select filters to identify eligible individuals for early cancer detection."
          ) : (
            `Showing eligible individuals for ${selectedCancerTypes.join(', ') || 'all cancer types'} 
            in age groups ${selectedAgeGroups.join(', ') || 'all ages'}
            ${selectedArea ? `in ${selectedArea}` : 'across all areas'}.`
          )}
        </p>
      </div>
    </div>
  );
};

export default CancerDetectionFilter;
