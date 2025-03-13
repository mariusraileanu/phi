import React from 'react';
import { Marker, Popup, LayerGroup } from 'react-leaflet';
import L from 'leaflet';

interface POILayerProps {
  points: Array<{
    id: string;
    position: [number, number];
    name: string;
    type: 'hospital' | 'clinic' | 'gym' | 'park' | 'screening' | 'other';
    description?: string;
  }>;
  visible: boolean;
  filterType?: string[];
}

const POILayer: React.FC<POILayerProps> = ({ 
  points, 
  visible,
  filterType = []
}) => {
  if (!visible) return null;
  
  // Filter points by type if filterType is provided
  const filteredPoints = filterType.length > 0 
    ? points.filter(point => filterType.includes(point.type))
    : points;
  
  // Custom icons for different POI types
  const getIcon = (type: string) => {
    let iconUrl = '/icons/marker-default.png';
    const iconSize: [number, number] = [25, 41];
    
    switch(type) {
      case 'hospital':
        iconUrl = '/icons/hospital.png';
        break;
      case 'clinic':
        iconUrl = '/icons/clinic.png';
        break;
      case 'gym':
        iconUrl = '/icons/gym.png';
        break;
      case 'park':
        iconUrl = '/icons/park.png';
        break;
      case 'screening':
        iconUrl = '/icons/screening.png';
        break;
      default:
        iconUrl = '/icons/marker-default.png';
    }
    
    return L.icon({
      iconUrl,
      iconSize,
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    });
  };
  
  return (
    <LayerGroup>
      {filteredPoints.map(point => (
        <Marker 
          key={point.id}
          position={point.position}
          icon={getIcon(point.type)}
        >
          <Popup>
            <div>
              <h3 className="font-bold">{point.name}</h3>
              <p className="text-sm">{point.description}</p>
              <p className="text-xs mt-1 text-gray-500">Type: {point.type}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </LayerGroup>
  );
};

export default POILayer;
