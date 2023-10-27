import { useRef, useState, useEffect, MutableRefObject, useMemo } from 'react';
import { Map, TileLayer, Icon, Marker, LayerGroup } from 'leaflet';
import { City, Offer } from '../types/offers-types';
import { URL_MARKER_CURRENT, URL_MARKER_DEFAULT } from '../const';

const defaultCustomIcon = new Icon({
  iconUrl: URL_MARKER_DEFAULT,
  iconSize: [27, 39],
  iconAnchor: [13, 39],
});

const currentCustomIcon = new Icon({
  iconUrl: URL_MARKER_CURRENT,
  iconSize: [27, 39],
  iconAnchor: [13, 39],
});

type UseMapProps = {
  city: City;
  points: Offer[];
  selectedPoint?: Offer | undefined;
};

export default function useMap(
  mapRef: MutableRefObject<HTMLElement | null>,
  prop: UseMapProps
): void {
  const [map, setMap] = useState<Map | null>(null);
  const isRenderedRef = useRef<boolean>(false);
  const { city, points, selectedPoint } = prop;

  const markersLayer = useMemo(() => new LayerGroup(), []);

  useEffect(() => {
    if (mapRef.current && !isRenderedRef.current) {
      const instance = new Map(mapRef.current, {
        center: {
          lat: city.location.latitude,
          lng: city.location.longitude,
        },
        zoom: city.location.zoom,
      });

      const layer = new TileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        }
      );

      instance.addLayer(layer);

      setMap(instance);
      isRenderedRef.current = true;

      markersLayer.addTo(instance);
    }
  }, [mapRef, city, markersLayer]);

  useEffect(() => {
    if (map) {
      // Очищаем предыдущие маркеры
      markersLayer.clearLayers();

      if (city) {
        map.setView(
          [city.location.latitude, city.location.longitude],
          city.location.zoom
        );

        points.forEach((offer) => {
          const marker = new Marker({
            lat: offer.location.latitude,
            lng: offer.location.longitude,
          });

          marker.setIcon(
            selectedPoint && selectedPoint.id === offer.id
              ? currentCustomIcon
              : defaultCustomIcon
          );

          markersLayer.addLayer(marker);
        });
      }
    }
  }, [map, points, selectedPoint, city, markersLayer]);
}
