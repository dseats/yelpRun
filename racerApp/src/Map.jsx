import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";

import Marker from "./Marker";
import MySlider from "./Slider";

const INITIAL_CENTER = [-73.9737, 40.6987];
const INITIAL_ZOOM = 10.86;

function Map() {
  const [count, setCount] = useState(0);

  const mapRef = useRef();

  const [center, setCenter] = useState(INITIAL_CENTER);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [geoData, setGeoData] = useState(null);
  const [value, setValue] = useState(30);
  const mapContainerRef = useRef();
  const [v, setV] = useState(30);
  useEffect(() => {
    fetch(import.meta.env.BASE_URL + "nyc.geojson")
      .then((res) => res.json())
      .then((data) => {
        setGeoData(data);
      })
      .catch((err) => console.error("Error loading GeoJSON:", err));
  }, []);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiZGNzZWF0czAxIiwiYSI6ImNscGc2amtudzFpbW8yaW93eDY0ODZjOXkifQ.Bbbg8UHQHsKDWJZ2TIVaVw";
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: center,
      zoom: zoom,
    });

    mapRef.current.on("style.load", () => {
      console.log("Map style loaded!");
      mapRef.current.setFog({});
    });
    mapRef.current.on("load", () => {
      mapRef.current.addSource("nyc-route", {
        type: "geojson",
        data: "/nyc.geojson",
      });

      mapRef.current.addLayer({
        id: "nyc-route-layer",
        type: "line",
        source: "nyc-route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#349beb",
          "line-width": 9,
        },
      });

      new mapboxgl.Marker()
        .setLngLat([-74.05850529670715, 40.60216238663875])
        .addTo(mapRef.current);
    });

    mapRef.current.on("move", () => {
      // get the current center coordinates and zoom level from the map
      const mapCenter = mapRef.current.getCenter();
      const mapZoom = mapRef.current.getZoom();

      // update state
      setCenter([mapCenter.lng, mapCenter.lat]);
      setZoom(mapZoom);
    });

    return () => {
      mapRef.current.remove();
    };
  }, []);

  const handleButtonClick = () => {
    mapRef.current.flyTo({
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    });
  };

  return (
    <>
      <div id="map-container" ref={mapContainerRef} />
      <Marker key={"m1"} map={mapRef.current} />

      <h1>This is slider</h1>
      <MySlider value={v} onChange={(_, nv) => setV(nv)} />
      <div>Value: {v}</div>
    </>
  );
}

export default Map;
