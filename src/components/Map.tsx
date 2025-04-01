import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Crime } from '../types';
import ReportForm from './ReportForm';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface MapProps {
  crimes: Crime[];
  onCrimeReported: (crime: Crime) => void;
}

const Map: React.FC<MapProps> = ({ crimes, onCrimeReported }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLng | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [heatmap, setHeatmap] = useState<google.maps.visualization.HeatmapLayer | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['visualization']
    });

    loader.load().then(() => {
      if (mapRef.current) {
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat: 40.7128, lng: -74.0060 }, // New York City coordinates
          zoom: 12,
          styles: [
            {
              featureType: 'all',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#6c757d' }]
            },
            {
              featureType: 'administrative',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#dee2e6' }]
            },
            {
              featureType: 'landscape',
              elementType: 'geometry',
              stylers: [{ color: '#f8f9fa' }]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#e9ecef' }]
            }
          ]
        });

        mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            setSelectedLocation(e.latLng);
            setShowForm(true);
          }
        });

        setMap(mapInstance);

        // Initialize heatmap
        const heatmapLayer = new google.maps.visualization.HeatmapLayer({
          map: mapInstance,
          data: crimes.map(crime => ({
            location: new google.maps.LatLng(crime.latitude, crime.longitude),
            weight: crime.severity === 'high' ? 3 : crime.severity === 'medium' ? 2 : 1
          }))
        });

        setHeatmap(heatmapLayer);
      }
    });
  }, []);

  useEffect(() => {
    if (heatmap && crimes.length > 0) {
      heatmap.setData(
        crimes.map(crime => ({
          location: new google.maps.LatLng(crime.latitude, crime.longitude),
          weight: crime.severity === 'high' ? 3 : crime.severity === 'medium' ? 2 : 1
        }))
      );
    }
  }, [crimes, heatmap]);

  const handleFormSubmit = (formData: any) => {
    if (selectedLocation) {
      const newCrime: Crime = {
        id: Math.random().toString(36).substr(2, 9),
        latitude: selectedLocation.lat(),
        longitude: selectedLocation.lng(),
        ...formData
      };
      onCrimeReported(newCrime);
      setShowForm(false);
      setSelectedLocation(null);
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg shadow-lg" />
      {showForm && selectedLocation && (
        <div className="absolute top-4 right-4 w-96">
          <ReportForm
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setSelectedLocation(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Map;