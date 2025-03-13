import { useEffect } from 'react';
import L from 'leaflet';

// Fix for Leaflet icon issue in Next.js
const LeafletFixScript = () => {
  useEffect(() => {
    // Fix Leaflet default icon issue
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/leaflet/marker-icon-2x.png',
      iconUrl: '/leaflet/marker-icon.png',
      shadowUrl: '/leaflet/marker-shadow.png',
    });
  }, []);

  return null;
};

export default LeafletFixScript;
