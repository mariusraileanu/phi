import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

// Extend window interface to include L.heatLayer
declare global {
  interface Window {
    L: typeof L & {
      heatLayer: (latlngs: Array<[number, number, number]>, options?: Record<string, unknown>) => L.Layer;
    };
  }
}

interface HeatmapLayerProps {
  points: Array<[number, number, number]>; // [lat, lng, intensity]
  radius?: number;
  blur?: number;
  max?: number;
  gradient?: {[key: string]: string};
  visible: boolean;
}

const HeatmapLayer: React.FC<HeatmapLayerProps> = ({ 
  points, 
  radius = 25, 
  blur = 15, 
  max = 1.0,
  gradient = { 0.4: 'blue', 0.65: 'lime', 1: 'red' },
  visible
}) => {
  const map = useMap();
  
  useEffect(() => {
    if (!visible) return;
    
    // Make sure window.L is available
    const L = window.L;
    
    // Create heatmap layer
    const heatLayer = L.heatLayer(points, {
      radius,
      blur,
      max,
      gradient
    }).addTo(map);
    
    // Cleanup on unmount or when visibility changes
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points, radius, blur, max, gradient, visible]);
  
  return null; // This component doesn't render anything directly
};

export default HeatmapLayer;
