import React, { useState } from 'react';
import { 
  BaseMap, 
  HeatmapLayer, 
  GeoJSONLayer, 
  POILayer, 
  LayerControl,
  HotspotInsights
} from '@/components/maps';
import { DemographicsDashboard } from '@/components/charts';
import districtBoundaries from '@/data/synthetic/district_boundaries.json';
import bmiData from '@/data/synthetic/bmi_data.json';
import healthcareFacilities from '@/data/synthetic/healthcare_facilities.json';
import healthCampaigns from '@/data/synthetic/health_campaigns.json';
import hotspots from '@/data/synthetic/hotspots.json';
import demographics from '@/data/synthetic/demographics.json';

const SummaryView = () => {
  // State for selected district and active layers
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [activeLayers, setActiveLayers] = useState({
    bmiHeatmap: true,
    districtBoundaries: true,
    hospitals: true,
    clinics: false,
    gyms: false,
    parks: false,
    screeningCenters: false,
    campaigns: true,
    obesityHotspots: false,
    screeningHotspots: false
  });

  // Filter healthcare facilities by type
  const hospitals = healthcareFacilities.filter(f => f.type === 'hospital');
  const clinics = healthcareFacilities.filter(f => f.type === 'clinic');
  const gyms = healthcareFacilities.filter(f => f.type === 'gym');
  const parks = healthcareFacilities.filter(f => f.type === 'park');
  const screeningCenters = healthcareFacilities.filter(f => f.type === 'screening');

  // Filter hotspots by type
  const obesityHotspots = hotspots.filter(h => h.type === 'obesity');
  const screeningHotspots = hotspots.filter(h => h.type === 'screening');

  // Get demographic data for selected district or use first district as default
  const districtDemographics = selectedDistrict 
    ? demographics.find(d => d.district === selectedDistrict) 
    : demographics[0];

  // Handle layer toggle
  const handleToggleLayer = (layerId) => {
    setActiveLayers({
      ...activeLayers,
      [layerId]: !activeLayers[layerId]
    });
  };

  // Handle district selection from GeoJSON
  const handleDistrictSelect = (feature) => {
    setSelectedDistrict(feature.properties.name);
  };

  // Define layer configuration for the control panel
  const layerConfig = [
    { id: 'bmiHeatmap', name: 'BMI Heatmap', isActive: activeLayers.bmiHeatmap, category: 'Health Indicators' },
    { id: 'districtBoundaries', name: 'District Boundaries', isActive: activeLayers.districtBoundaries, category: 'Boundaries' },
    { id: 'hospitals', name: 'Hospitals', isActive: activeLayers.hospitals, category: 'Healthcare Facilities' },
    { id: 'clinics', name: 'Clinics', isActive: activeLayers.clinics, category: 'Healthcare Facilities' },
    { id: 'gyms', name: 'Gyms', isActive: activeLayers.gyms, category: 'Public Infrastructure' },
    { id: 'parks', name: 'Parks', isActive: activeLayers.parks, category: 'Public Infrastructure' },
    { id: 'screeningCenters', name: 'Screening Centers', isActive: activeLayers.screeningCenters, category: 'Healthcare Facilities' },
    { id: 'campaigns', name: 'Health Campaigns', isActive: activeLayers.campaigns, category: 'Campaigns' },
    { id: 'obesityHotspots', name: 'Obesity Hotspots', isActive: activeLayers.obesityHotspots, category: 'Risk Areas' },
    { id: 'screeningHotspots', name: 'Screening Hotspots', isActive: activeLayers.screeningHotspots, category: 'Risk Areas' }
  ];

  // Style function for district boundaries
  const districtStyle = (feature) => {
    return {
      color: feature.properties.name === selectedDistrict ? '#4338CA' : '#3B82F6',
      weight: feature.properties.name === selectedDistrict ? 3 : 1,
      opacity: 0.7,
      fillOpacity: feature.properties.name === selectedDistrict ? 0.3 : 0.1
    };
  };

  // Function to handle feature interaction for district boundaries
  const onEachDistrict = (feature, layer) => {
    const districtName = feature.properties.name;
    const population = feature.properties.population.toLocaleString();
    
    layer.bindPopup(`
      <div class="p-2">
        <h3 class="font-bold">${districtName}</h3>
        <p>Population: ${population}</p>
      </div>
    `);
    
    layer.on({
      click: () => handleDistrictSelect(feature)
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Geospatial Public Health Insights</h1>
        <p className="text-sm">Abu Dhabi Health Data Visualization</p>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Map Container */}
        <div className="flex-1 relative">
          <div className="absolute inset-0">
            <BaseMap center={[24.4869, 54.3702]} zoom={11}>
              {/* BMI Heatmap Layer */}
              <HeatmapLayer 
                points={bmiData.heatmap} 
                radius={25}
                blur={15}
                max={1.0}
                gradient={{ 0.4: 'blue', 0.65: 'lime', 0.9: 'red' }}
                visible={activeLayers.bmiHeatmap}
              />
              
              {/* District Boundaries Layer */}
              <GeoJSONLayer 
                data={districtBoundaries}
                style={districtStyle}
                onEachFeature={onEachDistrict}
                visible={activeLayers.districtBoundaries}
              />
              
              {/* Healthcare Facilities Layers */}
              <POILayer 
                points={hospitals}
                visible={activeLayers.hospitals}
              />
              
              <POILayer 
                points={clinics}
                visible={activeLayers.clinics}
              />
              
              <POILayer 
                points={gyms}
                visible={activeLayers.gyms}
              />
              
              <POILayer 
                points={parks}
                visible={activeLayers.parks}
              />
              
              <POILayer 
                points={screeningCenters}
                visible={activeLayers.screeningCenters}
              />
              
              {/* Hotspot Layers */}
              <HotspotInsights 
                hotspots={obesityHotspots}
                visible={activeLayers.obesityHotspots}
              />
              
              <HotspotInsights 
                hotspots={screeningHotspots}
                visible={activeLayers.screeningHotspots}
              />
            </BaseMap>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="w-80 bg-gray-50 p-4 overflow-y-auto flex flex-col space-y-4">
          <LayerControl 
            layers={layerConfig}
            onToggleLayer={handleToggleLayer}
          />
          
          <DemographicsDashboard 
            populationData={{
              density: districtDemographics.density,
              nationalVsExpat: {
                national: districtDemographics.nationalVsExpat.national,
                expat: districtDemographics.nationalVsExpat.expat
              },
              genderDistribution: {
                male: districtDemographics.genderDistribution.male,
                female: districtDemographics.genderDistribution.female
              },
              ageGroups: districtDemographics.ageGroups
            }}
            region={selectedDistrict || 'Abu Dhabi (Overall)'}
          />
          
          {/* Active Health Campaigns Section */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">Active Health Campaigns</h3>
            <div className="space-y-2">
              {healthCampaigns.map(campaign => (
                <div key={campaign.id} className="p-2 border rounded-md">
                  <h4 className="font-medium">{campaign.name}</h4>
                  <p className="text-sm text-gray-600">{campaign.description}</p>
                  <div className="flex justify-between text-xs mt-1">
                    <span>{campaign.startDate} to {campaign.endDate}</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      {campaign.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryView;
