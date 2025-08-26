import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

const Marker = ({ map, feature }) => {
  const { geometry } = feature;

  const markerRef = useRef();

  useEffect(() => {
    markerRef.current = new mapboxgl.Marker()
      .setLngLat([geometry.coordinates[0], geometry.coordinates[1]])
      .addTo(map);

    return () => {
      markerRef.current.remove();
    };
  }, []);

  return null;
};

export default Marker;
