import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

// Replace with your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface MapDrawProps {
  initialCoordinates?: [number, number][];
  onChange: (coordinates: [number, number][]) => void;
}

export function MapDraw({ initialCoordinates, onChange }: MapDrawProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const draw = useRef<MapboxDraw | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.5, 40], // Default center
      zoom: 9,
    });

    // Initialize draw control
    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: 'draw_polygon',
    });

    // Add draw control to map
    map.current.addControl(draw.current);

    // Add initial polygon if coordinates exist
    if (initialCoordinates?.length >= 3) {
      map.current.on('load', () => {
        draw.current?.add({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [initialCoordinates],
          },
          properties: {},
        });

        // Fit map to polygon bounds
        const bounds = initialCoordinates.reduce(
          (bounds, coord) => bounds.extend(coord as [number, number]),
          new mapboxgl.LngLatBounds(initialCoordinates[0], initialCoordinates[0])
        );
        map.current?.fitBounds(bounds, { padding: 50 });
      });
    }

    // Event handlers for draw actions
    const handleUpdate = () => {
      const data = draw.current?.getAll();
      const polygons = data?.features.filter(
        (f) => f.geometry.type === 'Polygon'
      );
      
      if (polygons && polygons.length > 0) {
        const coordinates = polygons[0].geometry.coordinates[0] as [number, number][];
        onChange(coordinates);
      } else {
        onChange([]);
      }
    };

    map.current.on('draw.create', handleUpdate);
    map.current.on('draw.update', handleUpdate);
    map.current.on('draw.delete', handleUpdate);

    return () => {
      map.current?.remove();
    };
  }, []);

  return <div ref={mapContainer} className="w-full h-full" />;
}
