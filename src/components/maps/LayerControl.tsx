import React from 'react';

interface LayerControlProps {
  layers: {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    category?: string;
  }[];
  onToggleLayer: (layerId: string) => void;
}

const LayerControl: React.FC<LayerControlProps> = ({ layers, onToggleLayer }) => {
  // Group layers by category if available
  const groupedLayers = layers.reduce((acc, layer) => {
    const category = layer.category || 'Default';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(layer);
    return acc;
  }, {} as Record<string, typeof layers>);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3">Map Layers</h3>
      
      {Object.entries(groupedLayers).map(([category, categoryLayers]) => (
        <div key={category} className="mb-4">
          <h4 className="text-md font-medium text-gray-700 mb-2">{category}</h4>
          <div className="space-y-2">
            {categoryLayers.map(layer => (
              <div key={layer.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`layer-${layer.id}`}
                  checked={layer.isActive}
                  onChange={() => onToggleLayer(layer.id)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label 
                  htmlFor={`layer-${layer.id}`} 
                  className="ml-2 text-sm text-gray-700 cursor-pointer"
                  title={layer.description}
                >
                  {layer.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LayerControl;
