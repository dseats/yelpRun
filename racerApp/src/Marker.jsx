import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

const Marker = ({ map }) => {
  // const { geometry } = feature;

  const markerRef = useRef();

  useEffect(() => {
    markerRef.current = new mapboxgl.Marker()
      .setLngLat([-74.05850529670715, 40.60216238663875])
      .addTo(map);

    return () => {
      markerRef.current.remove();
    };
  }, []);

  return null;
};

export default Marker;
