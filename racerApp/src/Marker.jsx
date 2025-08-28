import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

const Marker = ({ map }, coords) => {
  // const { geometry } = feature;

  const markerRef = useRef();

  useEffect(() => {
    markerRef.current = new mapboxgl.Marker().setLngLat(coords).addTo(map);

    return () => {
      markerRef.current.remove();
    };
  }, []);

  return null;
};

export default Marker;
