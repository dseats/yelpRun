// import RaceMap from "./Map";
// import "mapbox-gl/dist/mapbox-gl.css";

import "leaflet/dist/leaflet.css";

import { MapContainer, TileLayer } from "react-leaflet";
// import { LatLngExpression } from "leaflet";

function App() {
  //   return (
  //     <>
  //       <MapContainer center={[48, 2.3]} zoom={13}>
  //         <TileLayer
  //           url={"https://tile.openstreetmap.org/{z}/{x}/{y}.png"}
  //         ></TileLayer>
  //       </MapContainer>
  //     </>
  //   );
  // }
  // const center: LatLngExpression = [48, 2.3]; // ✅ type-sa
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {" "}
      {/* ⬅ container must have height */}
      <MapContainer style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </div>
  );
}

export default App;
