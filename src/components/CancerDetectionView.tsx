import React, { useState, useEffect } from 'react';
import { 
  BaseMap, 
  GeoJSONLayer, 
  POILayer
} from '@/components/maps';
import L from 'leaflet';
import { CancerDetectionFilter } from '@/components/filters';
import districtBoundaries from '@/data/synthetic/district_boundaries.json';
import { FeatureCollection } from 'geojson';
import healthcareFacilities from '@/data/synthetic/healthcare_facilities.json';
import cancerScreeningData from '@/data/synthetic/cancer_screening.json';

const CancerDetectionView = () => {
  // State for filters and results
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedCancerTypes, setSelectedCancerTypes] = useState<string[]>([]);
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([]);
  const [eligibleIndividuals, setEligibleIndividuals] = useState<Array<{
    id: string;
    district: string;
    age_group: string;
    eligible_for: string;
    screened: boolean;
    screening_date: string | null;
  }>>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Array<{
    id: string;
    position: [number, number];
    name: string;
    type: 'hospital' | 'clinic' | 'gym' | 'park' | 'screening' | 'other';
    description?: string;
  }>>([]);
  
  // Extract available options from data
  const availableAreas = districtBoundaries.features.map(f => f.properties.name);
  const availableCancerTypes = cancerScreeningData.cancer_types;
  const availableAgeGroups = cancerScreeningData.age_groups;
  
  // Filter eligible individuals based on selections
  useEffect(() => {
    let filtered = cancerScreeningData.eligible_individuals;
    
    // Filter by area if selected
    if (selectedArea) {
      filtered = filtered.filter(individual => individual.district === selectedArea);
    }
    
    // Filter by cancer types if selected
    if (selectedCancerTypes.length > 0) {
      filtered = filtered.filter(individual => 
        selectedCancerTypes.includes(individual.eligible_for)
      );
    }
    
    // Filter by age groups if selected
    if (selectedAgeGroups.length > 0) {
      filtered = filtered.filter(individual => 
        selectedAgeGroups.includes(individual.age_group)
      );
    }
    
    // Only include individuals who haven't been screened
    filtered = filtered.filter(individual => !individual.screened);
    
    setEligibleIndividuals(filtered);
    
    // Filter healthcare facilities to show only screening centers in selected area
    let facilities = healthcareFacilities.filter(f => f.type === 'screening' || f.type === 'hospital');
    if (selectedArea) {
      facilities = facilities.filter(f => f.district === selectedArea);
    }
    // Type assertion to match the expected type
    setFilteredFacilities(facilities as unknown as Array<{
      id: string;
      position: [number, number];
      name: string;
      type: 'hospital' | 'clinic' | 'gym' | 'park' | 'screening' | 'other';
      description?: string;
    }>);
    
  }, [selectedArea, selectedCancerTypes, selectedAgeGroups]);
  
  // Handle filter changes
  const handleFilterChange = (filters: {
    cancerTypes: string[];
    ageGroups: string[];
    selectedArea?: string;
  }) => {
    setSelectedCancerTypes(filters.cancerTypes);
    setSelectedAgeGroups(filters.ageGroups);
    setSelectedArea(filters.selectedArea || '');
  };
  
  // Style function for district boundaries
  const districtStyle = {
    color: '#3B82F6',
    weight: 1,
    opacity: 0.7,
    fillOpacity: 0.1
  };
  
  // Function to handle feature interaction for district boundaries
  const onEachDistrict = (feature: GeoJSON.Feature, layer: L.Layer) => {
    const districtName = feature.properties?.name;
    
    layer.on({
      click: () => {
        handleFilterChange({
          cancerTypes: selectedCancerTypes,
          ageGroups: selectedAgeGroups,
          selectedArea: districtName
        });
      }
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Early Detection for Cancer</h1>
        <p className="text-sm">Identify eligible individuals for early cancer detection tests</p>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Map Container */}
        <div className="flex-1 relative">
          <div className="absolute inset-0">
            <BaseMap center={[24.4869, 54.3702]} zoom={11}>
              {/* District Boundaries Layer */}
              <GeoJSONLayer 
                data={districtBoundaries as unknown as FeatureCollection}
                style={districtStyle}
                onEachFeature={onEachDistrict}
                visible={true}
              />
              
              {/* Healthcare Facilities Layer */}
              <POILayer 
                points={filteredFacilities}
                visible={true}
              />
            </BaseMap>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="w-80 bg-gray-50 p-4 overflow-y-auto flex flex-col space-y-4">
          <CancerDetectionFilter 
            onFilterChange={handleFilterChange}
            availableCancerTypes={availableCancerTypes}
            availableAgeGroups={availableAgeGroups}
            availableAreas={availableAreas}
          />
          
          {/* Eligible Individuals List */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">
              Eligible Individuals ({eligibleIndividuals.length})
            </h3>
            
            {eligibleIndividuals.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {eligibleIndividuals.map(individual => (
                  <div key={individual.id} className="p-2 border rounded-md">
                    <h4 className="font-medium">ID: {individual.id}</h4>
                    <div className="grid grid-cols-2 text-sm">
                      <span className="text-gray-600">District:</span>
                      <span>{individual.district}</span>
                      
                      <span className="text-gray-600">Age Group:</span>
                      <span>{individual.age_group}</span>
                      
                      <span className="text-gray-600">Eligible For:</span>
                      <span>{individual.eligible_for} Cancer Screening</span>
                      
                      <span className="text-gray-600">Status:</span>
                      <span className="text-red-600 font-medium">Not Screened</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No eligible individuals found with the current filters.
              </div>
            )}
          </div>
          
          {/* Summary Statistics */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Eligible:</span>
                <span className="font-medium">{eligibleIndividuals.length}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Selected Area:</span>
                <span className="font-medium">{selectedArea || 'All Areas'}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Cancer Types:</span>
                <span className="font-medium">
                  {selectedCancerTypes.length > 0 
                    ? selectedCancerTypes.join(', ') 
                    : 'All Types'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Age Groups:</span>
                <span className="font-medium">
                  {selectedAgeGroups.length > 0 
                    ? selectedAgeGroups.join(', ') 
                    : 'All Ages'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancerDetectionView;
