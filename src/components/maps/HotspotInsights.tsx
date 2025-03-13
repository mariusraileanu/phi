import React, { useState } from 'react';
import { Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';

interface Hotspot {
  id: string;
  position: [number, number];
  radius: number;
  type: 'obesity' | 'screening' | 'other';
  name: string;
  insights: string[];
  riskLevel: 'high' | 'medium' | 'low';
}

interface HotspotInsightsProps {
  hotspots: Hotspot[];
  visible: boolean;
  onHotspotClick?: (hotspot: Hotspot) => void;
}

const HotspotInsights: React.FC<HotspotInsightsProps> = ({ 
  hotspots, 
  visible,
  onHotspotClick 
}) => {
  // Using setActiveHotspot for future functionality
  const [, setActiveHotspot] = useState<Hotspot | null>(null);
  const map = useMap();
  
  if (!visible) return null;
  
  // Get color based on risk level
  const getColor = (riskLevel: string) => {
    switch(riskLevel) {
      case 'high':
        return '#EF4444'; // red
      case 'medium':
        return '#F59E0B'; // amber
      case 'low':
        return '#10B981'; // green
      default:
        return '#3B82F6'; // blue
    }
  };
  
  // Handle hotspot click
  const handleHotspotClick = (hotspot: Hotspot) => {
    setActiveHotspot(hotspot);
    if (onHotspotClick) {
      onHotspotClick(hotspot);
    }
    
    // Pan to hotspot
    map.panTo(hotspot.position);
  };
  
  return (
    <>
      {hotspots.map(hotspot => (
        <React.Fragment key={hotspot.id}>
          <Circle
            center={hotspot.position}
            radius={hotspot.radius}
            pathOptions={{
              color: getColor(hotspot.riskLevel),
              fillColor: getColor(hotspot.riskLevel),
              fillOpacity: 0.3,
              weight: 2
            }}
            eventHandlers={{
              click: () => handleHotspotClick(hotspot)
            }}
          />
          <Marker
            position={hotspot.position}
            icon={L.divIcon({
              className: 'hotspot-marker',
              html: `<div style="background-color: ${getColor(hotspot.riskLevel)}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
              iconSize: [12, 12],
              iconAnchor: [6, 6]
            })}
            eventHandlers={{
              click: () => handleHotspotClick(hotspot)
            }}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-lg">{hotspot.name}</h3>
                <p className="text-sm text-gray-600 mb-2">Risk Level: {hotspot.riskLevel.toUpperCase()}</p>
                <div className="text-sm">
                  <h4 className="font-semibold mb-1">Insights:</h4>
                  <ul className="list-disc pl-5">
                    {hotspot.insights.map((insight, idx) => (
                      <li key={idx}>{insight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Popup>
          </Marker>
        </React.Fragment>
      ))}
    </>
  );
};

export default HotspotInsights;
