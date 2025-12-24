"use client"

import { useState } from "react"
import { WeatherOverlay } from "./weather-overlay";

type City = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  timezone: string;
  country_code: string;
}

export const CityTable = ({ cities, loading, onSelectCity, compare}: {cities: City[], loading: boolean, onSelectCity: (city: City) => void, compare: boolean}) => {

  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  if (loading) {
    return (<>
      <p className="text-2xl font-semibold text-blue-400 mb-2">Cargando...</p>
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </>
    );
  }
  if (!cities.length || cities.length === 0) {
    return <p>No se encontraron ciudades</p>
  }
  return (
    <>
      <table className="min-w-full border-collapse border border-sky-200">
        <thead>
          <tr className="bg-sky-500 text-white">
            <th className="py-3 px-6 text-left">Ciudad</th>
            <th className="py-3 px-6 text-left">País</th>
            <th className="py-3 px-6 text-left">Región</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city) => (
            <tr
              key={`${city.name} ${city.latitude} ${city.longitude}`}
              onClick={() => {
                if (compare) {
                  onSelectCity(city);
                } else {
                  setSelectedCity(city);
                }
              }}
              style={{ cursor: "pointer" }}
              className="border-t border-gray-200 hover:bg-blue-100 transition-colors"
            >
              <td className="py-2 px-6">{city.name}</td>
              <td className="py-2 px-6">{city.country}</td>
              <td className="py-2 px-6">{city.admin1 || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!compare && selectedCity ? (
        <WeatherOverlay city={selectedCity} onClose={() => setSelectedCity(null)} />
      ) : null}
    </>
  );
}