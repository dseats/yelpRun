// import { useRef, useEffect, useState } from "react";
// import mapboxgl from "mapbox-gl";
// import * as turf from "@turf/turf";

// import "mapbox-gl/dist/mapbox-gl.css";

// import Marker from "./Marker";
// import MySlider from "./Slider";

// const INITIAL_CENTER = [-73.9737, 40.6987];
// const INITIAL_ZOOM = 10.86;
// async function getData(name) {
//   const url = (import.meta.env?.BASE_URL ?? "/") + name + ".geojson"; // use name to build filename

//   try {
//     const res = await fetch(url, { cache: "no-store" }); // avoid cached copies
//     if (!res.ok) throw new Error(`HTTP ${res.status}`);

//     const data = await res.json(); // parse GeoJSON
//     // setGeoData(data);
//     console.log("Loaded GeoJSON:", data);

//     return data; // return it so you can capture it
//   } catch (e) {
//     console.error("Failed to load GeoJSON:", e);
//     setError(String(e));
//     return null; // return null or throw depending on desired behavior
//   }
// }
// const geoData = await getData("nyc");

// function Map() {
//   const [count, setCount] = useState(0);

//   const mapRef = useRef();

//   const [center, setCenter] = useState(INITIAL_CENTER);
//   const [zoom, setZoom] = useState(INITIAL_ZOOM);
//   //   const [geoData, setGeoData] = useState(null);
//   const [value, setValue] = useState(30);
//   const mapContainerRef = useRef();
//   const [v, setV] = useState(30);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     mapboxgl.accessToken =
//       "pk.eyJ1IjoiZGNzZWF0czAxIiwiYSI6ImNscGc2amtudzFpbW8yaW93eDY0ODZjOXkifQ.Bbbg8UHQHsKDWJZ2TIVaVw";
//     mapRef.current = new mapboxgl.Map({
//       container: mapContainerRef.current,
//       style: "mapbox://styles/mapbox/dark-v11",
//       center: center,
//       zoom: zoom,
//     });

//     mapRef.current.on("style.load", () => {
//       console.log("Map style loaded!");
//       mapRef.current.setFog({});
//     });
//     mapRef.current.on("load", () => {
//       mapRef.current.addSource("nyc-route", {
//         type: "geojson",
//         data: "/nyc.geojson",
//       });

//       mapRef.current.addLayer({
//         id: "nyc-route-layer",
//         type: "line",
//         source: "nyc-route",
//         layout: {
//           "line-join": "round",
//           "line-cap": "round",
//         },
//         paint: {
//           "line-color": "#349beb",
//           "line-width": 9,
//         },
//       });

//       new mapboxgl.Marker()
//         .setLngLat([-74.05850529670715, 40.60216238663875])
//         .addTo(mapRef.current);
//     });

//     mapRef.current.on("move", () => {
//       // get the current center coordinates and zoom level from the map
//       const mapCenter = mapRef.current.getCenter();
//       const mapZoom = mapRef.current.getZoom();

//       // update state
//       setCenter([mapCenter.lng, mapCenter.lat]);
//       setZoom(mapZoom);
//     });

//     return () => {
//       mapRef.current.remove();
//     };
//   }, []);

//   const handleButtonClick = () => {
//     mapRef.current.flyTo({
//       center: INITIAL_CENTER,
//       zoom: INITIAL_ZOOM,
//     });
//   };
//   //   console.log(`This is geodata ${geoData}`);
//   let totalDistance;
//   let point;
//   useEffect(() => {
//     if (geoData) {
//       console.log(`This is geodata ${geoData}`);

//       const geom = geoData.features.geometry;
//       console.log(JSON.stringify(geom));
//       const line = turf.lineString(geom.coordinates);
//       const totalDistance = turf.length(line, { units: "kilometers" });
//       const point = turf.along(line, 20, { units: "kilometers" });
//     }
//   }, [geoData]);

//   return (
//     <>
//       <div id="map-container" ref={mapContainerRef} />
//       <Marker key={"m1"} map={mapRef.current} />

//       <h1>This is slider</h1>
//       <MySlider value={v} onChange={(_, nv) => setV(nv)} />
//       <div>Value: {v}</div>

//       <h1>This is the Total distance {totalDistance}</h1>
//       <h1>This is the point {point}</h1>
//     </>
//   );
// }

// export default Map;
// import { useRef, useEffect, useState } from "react";
// import mapboxgl from "mapbox-gl";
// import * as turf from "@turf/turf";
// import "mapbox-gl/dist/mapbox-gl.css";

// import Marker from "./Marker";
// import MySlider from "./Slider";

// const INITIAL_CENTER = [-73.9737, 40.6987];
// const INITIAL_ZOOM = 10.86;

// async function fetchGeo(name) {
//   const url = (import.meta.env?.BASE_URL ?? "/") + `${name}.geojson`;
//   const res = await fetch(url, { cache: "no-store" });
//   if (!res.ok) throw new Error(`HTTP ${res.status}`);
//   return res.json();
// }

// function Map() {
//   const mapRef = useRef(null);
//   const markerRef = useRef(null);
//   const mapContainerRef = useRef(null);

//   const [center, setCenter] = useState(INITIAL_CENTER);
//   const [zoom, setZoom] = useState(INITIAL_ZOOM);

//   const [geoData, setGeoData] = useState(null);
//   const [lineFeature, setLineFeature] = useState(null); // Feature<LineString>
//   const [distanceKm, setDistanceKm] = useState(null);
//   const [pointAtKm, setPointAtKm] = useState(null);
//   const [v, setV] = useState(30);

//   const [error, setError] = useState(null);
//   // ✅ NEW: map readiness flag
//   const [mapReady, setMapReady] = useState(false);

//   useEffect(() => {
//     mapboxgl.accessToken =
//       "pk.eyJ1IjoiZGNzZWF0czAxIiwiYSI6ImNscGc2amtudzFpbW8yaW93eDY0ODZjOXkifQ.Bbbg8UHQHsKDWJZ2TIVaVw";
//     const map = new mapboxgl.Map({
//       container: mapContainerRef.current,
//       style: "mapbox://styles/mapbox/dark-v11",
//       center: INITIAL_CENTER,
//       zoom: INITIAL_ZOOM,
//     });
//     mapRef.current = map;

//     // Use the 'load' event — fires when the style & sources are ready to modify
//     map.on("load", () => {
//       setMapReady(true);
//       map.setFog({});
//     });

//     map.on("move", () => {
//       const c = map.getCenter();
//       setCenter([c.lng, c.lat]);
//       setZoom(map.getZoom());
//     });

//     return () => map.remove();
//   }, []);

//   // Fetch data once
//   useEffect(() => {
//     (async () => {
//       try {
//         const data = await fetchGeo("nyc");
//         setGeoData(data);
//       } catch (e) {
//         console.error(e);
//         setError(String(e));
//       }
//     })();
//   }, []);

//   // ✅ Only add/update source & layer when BOTH mapReady and geoData are present
//   useEffect(() => {
//     const map = mapRef.current;
//     if (!map || !mapReady || !geoData) return;

//     const sourceId = "nyc-route";
//     const layerId = "nyc-route-layer";

//     // If style ever reloads (e.g., style swap), re-add things:
//     if (!map.getSource(sourceId)) {
//       map.addSource(sourceId, { type: "geojson", data: geoData });
//     } else {
//       map.getSource(sourceId).setData(geoData);
//     }

//     if (!map.getLayer(layerId)) {
//       map.addLayer({
//         id: layerId,
//         type: "line",
//         source: sourceId,
//         layout: { "line-join": "round", "line-cap": "round" },
//         paint: { "line-color": "#349beb", "line-width": 9 },
//       });
//     }
//   }, [mapReady, geoData]);

//   // Turf computations
//   useEffect(() => {
//     if (!geoData) return;

//     let geom = null;
//     if (geoData.type === "FeatureCollection" && geoData.features?.length) {
//       geom = geoData.features[0].geometry;
//     } else if (geoData.type === "Feature") {
//       geom = geoData.geometry;
//     } else if (geoData.type === "LineString") {
//       geom = geoData;
//     }
//     if (!geom) return;

//     let line;
//     if (geom.type === "LineString") line = turf.feature(geom);
//     else if (geom.type === "MultiLineString")
//       line = turf.lineString(geom.coordinates[0]);
//     else return;

//     const totalKm = turf.length(line, { units: "kilometers" });
//     setDistanceKm(totalKm);

//     const atKm = Math.min(20, totalKm);
//     const pt = turf.along(line, atKm, { units: "kilometers" });
//     setPointAtKm(pt);
//   }, [geoData]);

//   useEffect(() => {
//     if (!geoData) return;

//     let geom = null;
//     if (geoData.type === "FeatureCollection" && geoData.features?.length) {
//       // If you have multiple lines, you can merge them; for now pick the first
//       geom = geoData.features[0].geometry;
//     } else if (geoData.type === "Feature") {
//       geom = geoData.geometry;
//     } else if (geoData.type === "LineString") {
//       geom = geoData;
//     }
//     if (!geom) return;

//     let line;
//     if (geom.type === "LineString") {
//       line = turf.feature(geom);
//     } else if (geom.type === "MultiLineString") {
//       line = turf.lineString(geom.coordinates[0]); // or merge
//     } else {
//       return;
//     }

//     setLineFeature(line);
//     setDistanceKm(turf.length(line, { units: "kilometers" }));
//   }, [geoData]);

//   useEffect(() => {
//     if (!mapReady || !mapRef.current) return;
//     if (markerRef.current) return; // already made

//     markerRef.current = new mapboxgl.Marker();
//     markerRef.current.addTo(mapRef.current);
//   }, [mapReady]);

//   useEffect(() => {
//     if (!markerRef.current || !lineFeature || !distanceKm) return;

//     // Interpret slider 0..100 as percentage of total length
//     const dKm = (v / 100) * distanceKm;
//     const pt = turf.along(lineFeature, dKm, { units: "kilometers" });
//     const [lng, lat] = pt.geometry.coordinates;

//     markerRef.current.setLngLat([lng, lat]);

//     // Optional: keep map centered on the moving point:
//     // mapRef.current?.easeTo({ center: [lng, lat], duration: 300 });
//   }, [v, lineFeature, distanceKm]);

//   const flyHome = () => {
//     const map = mapRef.current;
//     if (!map) return;
//     map.flyTo({ center: INITIAL_CENTER, zoom: INITIAL_ZOOM });
//   };

//   return (
//     <>
//       <div
//         id="map-container"
//         ref={mapContainerRef}
//         style={{ width: "100%", height: "70vh" }}
//       />

//       {/* Only render Marker when the map exists */}
//       {/* {mapRef.current && (
//         <Marker key="m1" map={mapRef.current} coords={coords} />
//       )} */}

//       <div style={{ padding: "12px 0" }}>
//         <button onClick={flyHome}>Reset view</button>
//       </div>

//       <h3>
//         Center: {center[0].toFixed(5)}, {center[1].toFixed(5)} | Zoom:{" "}
//         {zoom.toFixed(2)}
//       </h3>

//       <h4>Slider</h4>
//       <MySlider
//         value={v}
//         onChange={(_, nv) => setV(nv)}
//         max={distanceKm?.toFixed?.(2)}
//       />
//       <div>Value: {v}</div>

//       <h4>Geo metrics</h4>
//       {error && <div style={{ color: "salmon" }}>Error: {error}</div>}
//       <div>Total distance (km): {distanceKm?.toFixed?.(2) ?? "—"}</div>
//       <div>
//         Point @ 20km:{" "}
//         {pointAtKm ? JSON.stringify(pointAtKm.geometry.coordinates) : "—"}
//       </div>
//     </>
//   );
// }

// export default Map;
// Map.jsx
import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
import "mapbox-gl/dist/mapbox-gl.css";

import Marker from "./Marker"; // keep your existing component
import MySlider from "./Slider"; // the controlled MUI wrapper we discussed

const INITIAL_CENTER = [-73.9737, 40.6987];
const INITIAL_ZOOM = 10.86;
const ROUTE_SOURCE_ID = "nyc-route";
const ROUTE_LAYER_ID = "nyc-route-layer";
const ROUTE_POINT_SOURCE_ID = "route-point"; // optional point layer (kept for demo)

async function fetchGeo(name) {
  const url = (import.meta.env?.BASE_URL ?? "/") + `${name}.geojson`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
function asLngLat(coords) {
  if (!Array.isArray(coords) || coords.length !== 2) return null;
  const lng = Number(coords[0]);
  const lat = Number(coords[1]);
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;
  return [lng, lat]; // always return [lng, lat]
}

export default function Map() {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markerRef = useRef(null);

  const [mapReady, setMapReady] = useState(false);

  const [center, setCenter] = useState(INITIAL_CENTER);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);

  const [geoData, setGeoData] = useState(null);
  const [lineFeature, setLineFeature] = useState(null); // Feature<LineString>
  const [distanceKm, setDistanceKm] = useState(null); // total line length
  const [error, setError] = useState(null);

  // Slider represents progress along route (0..100%)
  const [v, setV] = useState(30);

  // 1) Init map
  useEffect(() => {
    // Put your token in Vite env: VITE_MAPBOX_TOKEN=xxxx
    mapboxgl.accessToken =
      import.meta.env.VITE_MAPBOX_TOKEN ||
      "pk.eyJ1IjoiZGNzZWF0czAxIiwiYSI6ImNscGc2amtudzFpbW8yaW93eDY0ODZjOXkifQ.Bbbg8UHQHsKDWJZ2TIVaVw";

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    });
    mapRef.current = map;

    map.on("load", () => {
      setMapReady(true);
      // fog tweak is safe after 'load'
      map.setFog({});
    });

    map.on("move", () => {
      const c = map.getCenter();
      setCenter([c.lng, c.lat]);
      setZoom(map.getZoom());
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 2) Fetch GeoJSON once
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchGeo("nyc"); // change "nyc" if needed
        setGeoData(data);
      } catch (e) {
        console.error(e);
        setError(String(e));
      }
    })();
  }, []);

  // 3) Build a LineString Feature and total length when geoData is ready
  useEffect(() => {
    if (!geoData) return;

    let geom = null;
    if (geoData.type === "FeatureCollection" && geoData.features?.length) {
      // If your file contains multiple lines, consider merging; for now, take the first
      geom = geoData.features[0].geometry;
    } else if (geoData.type === "Feature") {
      geom = geoData.geometry;
    } else if (
      geoData.type === "LineString" ||
      geoData.type === "MultiLineString"
    ) {
      geom = geoData;
    }
    if (!geom) return;

    let line;
    if (geom.type === "LineString") {
      line = turf.feature(geom);
    } else if (geom.type === "MultiLineString") {
      // Option A: first segment; Option B: merge/concatenate for full length
      line = turf.lineString(geom.coordinates[0]);
    } else {
      return; // not a line geometry
    }

    setLineFeature(line);
    setDistanceKm(turf.length(line, { units: "kilometers" }));
  }, [geoData]);

  // 4) Add source + layer when map is ready and we have data
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !geoData) return;

    // Route source
    if (!map.getSource(ROUTE_SOURCE_ID)) {
      map.addSource(ROUTE_SOURCE_ID, { type: "geojson", data: geoData });
    } else {
      map.getSource(ROUTE_SOURCE_ID).setData(geoData);
    }

    // Route layer
    if (!map.getLayer(ROUTE_LAYER_ID)) {
      map.addLayer({
        id: ROUTE_LAYER_ID,
        type: "line",
        source: ROUTE_SOURCE_ID,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#349beb", "line-width": 9 },
      });
    }

    // Optional: a styled point layer that mirrors the moving marker (kept for reference)
    if (!map.getSource(ROUTE_POINT_SOURCE_ID)) {
      map.addSource(ROUTE_POINT_SOURCE_ID, {
        type: "geojson",
        data: turf.point(INITIAL_CENTER),
      });
      map.addLayer({
        id: "route-point-layer",
        type: "circle",
        source: ROUTE_POINT_SOURCE_ID,
        paint: { "circle-radius": 5, "circle-color": "#ffffff" },
      });
    }
  }, [mapReady, geoData]);

  // 5) Create the Mapbox Marker after map is ready
  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;
    if (markerRef.current) return; // avoid duplicate creation (StrictMode/double-run)

    // Start the marker at a safe initial position (map center)
    markerRef.current = new mapboxgl.Marker()
      .setLngLat(INITIAL_CENTER)
      .addTo(map);

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [mapReady]);

  // 6) Move marker (and optional point layer) when slider changes
  useEffect(() => {
    if (!markerRef.current || !lineFeature || !distanceKm) return;

    const dKm = (v / 100) * distanceKm; // v is 0..100 (%)
    const pt = turf.along(lineFeature, dKm, { units: "kilometers" });
    const here = asLngLat(pt?.geometry?.coordinates);
    if (here) {
      markerRef.current.setLngLat(here);
      const map = mapRef.current;
      map?.getSource(ROUTE_POINT_SOURCE_ID)?.setData(turf.point(here)); // if you kept the point layer
    }
  }, [v, lineFeature, distanceKm]);

  const flyHome = () => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({ center: INITIAL_CENTER, zoom: INITIAL_ZOOM });
  };

  // Optional: fit to route bounds when loaded
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !geoData) return;
    try {
      const bounds = turf.bbox(geoData);
      map.fitBounds(bounds, { padding: 40, duration: 600 });
    } catch {
      // ignore if bbox fails (e.g., non-spatial data)
    }
  }, [mapReady, geoData]);

  return (
    <>
      {/* Make sure this has height or the map won't be visible */}
      <div
        id="map-container"
        ref={mapContainerRef}
        style={{
          width: "100%",
          height: "70vh",
          position: "relative",
          zIndex: 0,
        }}
      />

      {/* If your custom Marker component needs the raw map instance */}
      {/* {mapRef.current && <Marker key="m1" map={mapRef.current} />} */}

      <div style={{ padding: 12, position: "relative", zIndex: 1 }}>
        <button onClick={flyHome}>Reset view</button>
        <div style={{ marginTop: 8 }}>
          <strong>
            Center:&nbsp;{center[0].toFixed(5)}, {center[1].toFixed(5)}
          </strong>
          &nbsp;|&nbsp;Zoom: {zoom.toFixed(2)}
        </div>

        <div style={{ marginTop: 16 }}>
          <h4 style={{ margin: "8px 0" }}>Marker position along route</h4>
          <MySlider
            value={v}
            onChange={(_, nv) => setV(nv)}
            min={0}
            max={100}
            step={1}
          />
          <div>Progress: {v}%</div>
          <div>Total distance: {distanceKm?.toFixed?.(2) ?? "—"} km</div>
          {error && (
            <div style={{ color: "salmon", marginTop: 8 }}>Error: {error}</div>
          )}
        </div>
      </div>
    </>
  );
}
