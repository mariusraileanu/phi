import React, { useState, useEffect } from 'react';
import { 
  BaseMap, 
  GeoJSONLayer, 
  POILayer, 
  HotspotInsights
} from '@/components/maps';
import districtBoundaries from '@/data/synthetic/district_boundaries.json';
import healthcareFacilities from '@/data/synthetic/healthcare_facilities.json';
import hotspots from '@/data/synthetic/hotspots.json';

const HotspotInsightsView = () => {
  // State for selected hotspot and visible facilities
  const [selectedHotspot, setSelectedHotspot] = useState<Record<string, unknown> | null>(null);
  const [visibleFacilities, setVisibleFacilities] = useState<Array<Record<string, unknown>>>([]);
  const [activeHotspotType, setActiveHotspotType] = useState<'obesity' | 'screening'>('obesity');
  
  // Filter hotspots by type
  const filteredHotspots = hotspots.filter(h => h.type === activeHotspotType);
  
  // Update visible facilities when hotspot is selected
  useEffect(() => {
    if (selectedHotspot) {
      // Filter facilities by district and relevant types
      let relevantTypes: string[] = [];
      
      if (activeHotspotType === 'obesity') {
        relevantTypes = ['gym', 'park', 'hospital', 'clinic'];
      } else if (activeHotspotType === 'screening') {
        relevantTypes = ['hospital', 'screening', 'clinic'];
      }
      
      const facilities = healthcareFacilities.filter(f => 
        f.district === selectedHotspot.district && 
        relevantTypes.includes(f.type)
      );
      
      setVisibleFacilities(facilities);
    } else {
      setVisibleFacilities([]);
    }
  }, [selectedHotspot, activeHotspotType]);
  
  // Handle hotspot click
  const handleHotspotClick = (hotspot) => {
    setSelectedHotspot(hotspot);
  };
  
  // Style function for district boundaries
  const districtStyle = (feature) => {
    return {
      color: selectedHotspot && feature.properties.name === selectedHotspot.district 
        ? '#4338CA' 
        : '#3B82F6',
      weight: selectedHotspot && feature.properties.name === selectedHotspot.district ? 3 : 1,
      opacity: 0.7,
      fillOpacity: selectedHotspot && feature.properties.name === selectedHotspot.district ? 0.3 : 0.1
    };
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Hotspots and High-Risk Insights</h1>
        <p className="text-sm">Interact with predefined high-risk hotspots to receive insights</p>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Map Container */}
        <div className="flex-1 relative">
          <div className="absolute inset-0">
            <BaseMap center={[24.4869, 54.3702]} zoom={11}>
              {/* District Boundaries Layer */}
              <GeoJSONLayer 
                data={districtBoundaries}
                style={districtStyle}
                visible={true}
              />
              
              {/* Hotspots Layer */}
              <HotspotInsights 
                hotspots={filteredHotspots}
                visible={true}
                onHotspotClick={handleHotspotClick}
              />
              
              {/* Healthcare Facilities Layer */}
              <POILayer 
                points={visibleFacilities}
                visible={visibleFacilities.length > 0}
              />
            </BaseMap>
          </div>
          
          {/* Hotspot Type Selector */}
          <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-md z-[1000]">
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 rounded-md ${
                  activeHotspotType === 'obesity' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => setActiveHotspotType('obesity')}
              >
                Obesity Hotspots
              </button>
              <button
                className={`px-3 py-1 rounded-md ${
                  activeHotspotType === 'screening' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => setActiveHotspotType('screening')}
              >
                Screening Hotspots
              </button>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="w-80 bg-gray-50 p-4 overflow-y-auto">
          {selectedHotspot ? (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className={`inline-block w-3 h-3 rounded-full mr-2 ${
                  selectedHotspot.riskLevel === 'high' 
                    ? 'bg-red-500' 
                    : selectedHotspot.riskLevel === 'medium' 
                      ? 'bg-amber-500' 
                      : 'bg-green-500'
                }`}></div>
                <h3 className="text-lg font-semibold inline-block">{selectedHotspot.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Risk Level: <span className="font-medium">{selectedHotspot.riskLevel.toUpperCase()}</span>
                </p>
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Insights:</h4>
                  <ul className="space-y-2">
                    {selectedHotspot.insights.map((insight, idx) => (
                      <li key={idx} className="bg-blue-50 p-2 rounded-md text-sm">
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-3">Nearby Facilities</h3>
                {visibleFacilities.length > 0 ? (
                  <div className="space-y-2">
                    {visibleFacilities.map(facility => (
                      <div key={facility.id} className="p-2 border rounded-md">
                        <h4 className="font-medium">{facility.name}</h4>
                        <p className="text-sm text-gray-600">{facility.description}</p>
                        <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
                          {facility.type}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No relevant facilities found in this area.
                  </p>
                )}
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-3">Recommended Actions</h3>
                <ul className="space-y-2 text-sm">
                  {activeHotspotType === 'obesity' ? (
                    <>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Increase physical activity programs in this area</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Promote healthy eating initiatives at local schools</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Develop community fitness challenges</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Organize mobile screening events in this area</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Conduct targeted awareness campaigns</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Provide transportation assistance to screening centers</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <svg className="w-16 h-16 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <h3 className="text-lg font-semibold mt-4">Select a Hotspot</h3>
              <p className="text-gray-600 mt-2">
                Click on any {activeHotspotType} hotspot on the map to view detailed insights and nearby facilities.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotspotInsightsView;
