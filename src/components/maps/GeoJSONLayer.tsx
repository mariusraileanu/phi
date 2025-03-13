import React from 'react';
import { GeoJSON } from 'react-leaflet';
import L from 'leaflet';

interface GeoJSONLayerProps {
  data: GeoJSON.FeatureCollection;
  style?: L.PathOptions;
  visible: boolean;
  onEachFeature?: (feature: GeoJSON.Feature, layer: L.Layer) => void;
}

const GeoJSONLayer: React.FC<GeoJSONLayerProps> = ({ 
  data, 
  style = { 
    color: '#3388ff',
    weight: 2,
    opacity: 0.65,
    fillOpacity: 0.2
  }, 
  visible,
  onEachFeature
}) => {
  if (!visible) return null;
  
  return (
    <GeoJSON 
      data={data} 
      style={style}
      onEachFeature={onEachFeature}
    />
  );
};

export default GeoJSONLayer;
