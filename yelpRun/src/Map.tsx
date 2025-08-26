import React, { useEffect, useRef } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"; // ⬅️ REQUIRED for tiles to show

// Put your token here
mapboxgl.accessToken =
  "pk.eyJ1IjoiZGNzZWF0czAxIiwiYSI6ImNscGc2amtudzFpbW8yaW93eDY0ODZjOXkifQ.Bbbg8UHQHsKDWJZ2TIVaVw";

const RaceMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Prevent multiple initializations in dev hot reload
    if (mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-73.9857, 40.7484], // NYC coords
      zoom: 12,
    });

    mapRef.current = map;

    map.on("load", () => {
      // Test marker so you know map loaded
      new mapboxgl.Marker().setLngLat([-73.9857, 40.7484]).addTo(map);

      // Uncomment after verifying basemap works
      // map.addSource("raceRoute", {
      //   type: "geojson",
      //   data: "/nyc_marathon_route.geojson",
      // });
      // map.addLayer({
      //   id: "raceRouteLine",
      //   type: "line",
      //   source: "raceRoute",
      //   paint: {
      //     "line-color": "#FF0000",
      //     "line-width": 4,
      //   },
      // });
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: "100%",
        height: "100vh", // ⬅️ make sure it fills viewport
      }}
    />
  );
};

export default RaceMap;
