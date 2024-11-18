import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface ServiceArea {
  id: string;
  name: string;
  coordinates: [number, number][];
  active: boolean;
  baseRate: number;
}

interface ServiceAreaMapProps {
  area: ServiceArea;
}

export function ServiceAreaMap({ area }: ServiceAreaMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: area.coordinates[0], // Center on first coordinate
      zoom: 11,
    });

    map.current.on('load', () => {
      if (!map.current) return;

      // Add the polygon source
      map.current.addSource('service-area', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [area.coordinates],
          },
          properties: {
            name: area.name,
            baseRate: area.baseRate,
            active: area.active,
          },
        },
      });

      // Add fill layer
      map.current.addLayer({
        id: 'service-area-fill',
        type: 'fill',
        source: 'service-area',
        paint: {
          'fill-color': area.active ? '#3b82f6' : '#ef4444',
          'fill-opacity': 0.2,
        },
      });

      // Add outline layer
      map.current.addLayer({
        id: 'service-area-outline',
        type: 'line',
        source: 'service-area',
        paint: {
          'line-color': area.active ? '#2563eb' : '#dc2626',
          'line-width': 2,
        },
      });

      // Fit map to polygon bounds
      const bounds = area.coordinates.reduce(
        (bounds, coord) => bounds.extend(coord as [number, number]),
        new mapboxgl.LngLatBounds(area.coordinates[0], area.coordinates[0])
      );
      map.current.fitBounds(bounds, { padding: 50 });

      // Add popup on hover
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      map.current.on('mouseenter', 'service-area-fill', (e) => {
        if (!map.current) return;
        
        map.current.getCanvas().style.cursor = 'pointer';

        const coordinates = e.lngLat;
        const properties = e.features?.[0].properties;

        if (properties) {
          const html = `
            <div class="p-2">
              <h3 class="font-semibold">${properties.name}</h3>
              <p>Base Rate: $${properties.baseRate}</p>
              <p>Status: ${properties.active ? 'Active' : 'Inactive'}</p>
            </div>
          `;

          popup
            .setLngLat(coordinates)
            .setHTML(html)
            .addTo(map.current);
        }
      });

      map.current.on('mouseleave', 'service-area-fill', () => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = '';
        popup.remove();
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [area]);

  return (
    <div className="w-full h-[500px] rounded-md overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
