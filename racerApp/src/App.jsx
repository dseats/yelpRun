import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Marker from "./Marker";
import "./App.css";

import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
// import route from "/nyc.geojson";
import "mapbox-gl/dist/mapbox-gl.css";

// const route = require("./nyc.geojson");
import "./App.css";
const INITIAL_CENTER = [-73.9737, 40.6987];
const INITIAL_ZOOM = 10.86;

function App() {
  const [count, setCount] = useState(0);
  const mapRef = useRef();
  const [center, setCenter] = useState(INITIAL_CENTER);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [geoData, setGeoData] = useState(null);

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
      style: "mapbox://styles/mapbox/dark-v11", // 👈 add this
      center: center,
      zoom: zoom,
    });

    mapRef.current.on("style.load", () => {
      console.log("Map style loaded!");
      mapRef.current.setFog({});
      // if (!mapRef.current.getSource("NYC-Route")) {
    });
    mapRef.current.on("load", () => {
      mapRef.current.addSource("nyc-route", {
        type: "geojson",
        data: "/nyc.geojson",
        // data: "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson",
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
    });
    // const marker = new mapboxgl.Marker({ color: "red" })
    //   .setLngLat(routeData.features[0].geometry.coordinates[0])
    //   .addTo(mapRef);

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

  const mapContainerRef = useRef();
  const handleButtonClick = () => {
    mapRef.current.flyTo({
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    });
  };
  //   <div className="sidebar">
  //   Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} |
  //   Zoom: {zoom.toFixed(2)}
  // </div>
  // <button className="reset-button" onClick={handleButtonClick}>
  //   Reset
  // </button>
  const feature = geoData.features[0];
  console.log(feature);

  return (
    <>
      <h1 className="title2">New York City Marathon Race 2025</h1>

      <div id="map-container" ref={mapContainerRef} />
    </>
  );
}

export default App;
