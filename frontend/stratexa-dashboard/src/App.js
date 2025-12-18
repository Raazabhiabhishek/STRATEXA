import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMapEvents,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function App() {
  const [terrain, setTerrain] = useState("plain");
  const [weather, setWeather] = useState("clear");
  const [threatLevel, setThreatLevel] = useState("low");
  const [result, setResult] = useState(null);

  // ✅ NEW: Dynamic operation location
  const [location, setLocation] = useState({
    lat: 28.6139,
    lng: 77.2090, // Default: Delhi
  });

  const analyzeDecision = async () => {
    const response = await fetch(
      "https://stratexa.onrender.com/api/decision/analyze",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ terrain, weather, threatLevel }),
      }
    );
    const data = await response.json();
    setResult(data);
  };

  const getRiskStyle = () => {
    if (!result) return { radius: 5000, color: "green" };

    switch (result.output.riskStatus) {
      case "HIGH RISK":
        return { radius: 20000, color: "red" };
      case "MEDIUM RISK":
        return { radius: 10000, color: "yellow" };
      default:
        return { radius: 5000, color: "green" };
    }
  };

  // ✅ NEW: Handle map click
  const handleMapClick = (e) => {
    setLocation({
      lat: e.latlng.lat,
      lng: e.latlng.lng,
    });
  };
  function LocationSelector({ setLocation }) {
  useMapEvents({
    click(e) {
      setLocation({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });
  return null;
}


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-green-400 mb-6">
          STRATEXA Command Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block mb-2 text-sm text-gray-300">Terrain</label>
            <select
              className="w-full p-2 rounded bg-gray-700 text-white"
              onChange={(e) => setTerrain(e.target.value)}
            >
              <option value="plain">Plain</option>
              <option value="mountain">Mountain</option>
              <option value="forest">Forest</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-300">Weather</label>
            <select
              className="w-full p-2 rounded bg-gray-700 text-white"
              onChange={(e) => setWeather(e.target.value)}
            >
              <option value="clear">Clear</option>
              <option value="fog">Fog</option>
              <option value="rain">Rain</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-300">Threat Level</label>
            <select
              className="w-full p-2 rounded bg-gray-700 text-white"
              onChange={(e) => setThreatLevel(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <button
          onClick={analyzeDecision}
          className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-2 rounded transition"
        >
          Analyze Operation
        </button>

        {result && (
          <div className="mt-6 bg-gray-700 p-5 rounded-lg">
            <h2 className="text-xl font-semibold text-green-400 mb-3">
              AI Decision Output
            </h2>

            <p className="mb-2">
              <b>Risk Score:</b> {result.output.riskScore}
            </p>

            <p className="mb-2">
              <b>Status:</b>{" "}
              <span
                className={`px-3 py-1 rounded font-semibold ${
                  result.output.riskStatus === "HIGH RISK"
                    ? "bg-red-500 text-white"
                    : result.output.riskStatus === "MEDIUM RISK"
                    ? "bg-yellow-400 text-black"
                    : "bg-green-500 text-white"
                }`}
              >
                {result.output.riskStatus}
              </span>
            </p>

            <p className="mt-3">
              <b>Recommendation:</b> {result.output.recommendation}
            </p>
          </div>
        )}

        {result && (
          <div className="mt-6 bg-gray-800 p-5 rounded-lg">
            <h2 className="text-xl font-semibold text-green-400 mb-3">
              Risk Analysis Chart
            </h2>

            <Bar
              data={{
                labels: ["Risk Score"],
                datasets: [
                  {
                    label: "AI Risk Score",
                    data: [result.output.riskScore],
                    backgroundColor:
                      result.output.riskStatus === "HIGH RISK"
                        ? "rgba(239,68,68,0.8)"
                        : result.output.riskStatus === "MEDIUM RISK"
                        ? "rgba(250,204,21,0.8)"
                        : "rgba(34,197,94,0.8)",
                  },
                ],
              }}
              options={{
                responsive: true,
                scales: {
                  y: { min: 0, max: 100 },
                },
              }}
            />
          </div>
        )}

        {result && (
          <div className="mt-6 bg-gray-800 p-5 rounded-lg">
            <h2 className="text-xl font-semibold text-green-400 mb-3">
              Operation Risk Zone (Click Map to Select Area)
            </h2>

            <MapContainer
  center={[location.lat, location.lng]}
  zoom={6}
  style={{ height: "300px", width: "100%" }}
  className="rounded-lg"
>
  <TileLayer
    attribution="&copy; OpenStreetMap contributors"
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />

  {/* ✅ THIS IS THE FIX */}
  <LocationSelector setLocation={setLocation} />

  <Marker position={[location.lat, location.lng]}>
    <Popup>Selected Operation Area</Popup>
  </Marker>

  <Circle
    center={[location.lat, location.lng]}
    radius={getRiskStyle().radius}
    pathOptions={{
      color: getRiskStyle().color,
      fillColor: getRiskStyle().color,
      fillOpacity: 0.3,
    }}
  />
</MapContainer>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;
