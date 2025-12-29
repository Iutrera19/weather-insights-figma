"use client";

import { useState, useEffect } from "react";
import { CountrySearch } from "@/components/country-search";

type City = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  timezone: string;
  country_code: string;
};

type Weather = {
  current: {
    temperature_2m: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    weather_code: number;
    precipitation_probability: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
};

export default function ComparePage() {
  const [city1, setCity1] = useState<City | null>(null);
  const [city2, setCity2] = useState<City | null>(null);

  const [weather1, setWeather1] = useState<Weather | null>(null);
  const [weather2, setWeather2] = useState<Weather | null>(null);

  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [error1, setError1] = useState<string | null>(null);
  const [error2, setError2] = useState<string | null>(null);

  const fetchWeather = async (
    city: City,
    setWeather: React.Dispatch<React.SetStateAction<Weather | null>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/city-weather?latitude=${city.latitude.toFixed(2)}&longitude=${city.longitude.toFixed(2)}`
      );
      if (!res.ok) throw new Error(`Error obteniendo el clima`);
      const data = await res.json();
      setWeather(data);
    } catch {
      setWeather(null);
      setError("No se pudo cargar el clima");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (city1) fetchWeather(city1, setWeather1, setLoading1, setError1);
  }, [city1]);

  useEffect(() => {
    if (city2) fetchWeather(city2, setWeather2, setLoading2, setError2);
  }, [city2]);

  const formatValue = (value: number | undefined | null, suffix = "") =>
    value !== undefined && value !== null ? `${value}${suffix}` : "–";

  return (
    <div className="flex flex-col items-center space-y-6 p-4">
      <h1 className="text-2xl font-semibold text-sky-600 mb-2">Comparar Ciudades</h1>

      <div className="flex flex-row items-start space-x-6">
        <div className="flex flex-col items-center">
          <CountrySearch />
          {city1 && <h2 className="text-xl font-semibold mt-4 text-blue-500">{`${city1.name} - ${city1.country}`}</h2>}
          {error1 && <p className="text-red-500 mt-2">{error1}</p>}
        </div>
        <div className="flex flex-col items-center">
          <CountrySearch />
          {city2 && <h2 className="text-xl font-semibold mt-4 text-blue-500">{`${city2.name} - ${city2.country}`}</h2>}
          {error2 && <p className="text-red-500 mt-2">{error2}</p>}
        </div>
      </div>

      {!city1 || !city2 ? (
        <p>Busca y selecciona dos ciudades para comparar.</p>
      ) : null}

      {(city1 && city2) && (!error1 && !error2) && (
        <div className="mt-6">
          <table className="min-w-full border-collapse border border-sky-200">
            <thead>
              <tr className="bg-sky-500 text-white">
                <th className="py-3 px-6 text-left"></th>
                <th className="py-3 px-6 text-left">{city1.name}</th>
                <th className="py-3 px-6 text-left">{city2.name}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-sky-200 hover:bg-blue-100 transition-colors cursor-default">
                <td className="py-2 px-6 text-left font-semibold bg-sky-200">Temperatura Actual (°C)</td>
                <td className="py-2 px-6 text-left">{loading1 ? "Cargando..." : Math.round(weather1?.current.temperature_2m ?? 0)}</td>
                <td className="py-2 px-6 text-left">{loading2 ? "Cargando..." : Math.round(weather2?.current.temperature_2m ?? 0)}</td>
              </tr>
              <tr className="border-t border-sky-200 hover:bg-blue-100 transition-colors cursor-default">
                <td className="py-2 px-6 text-left font-semibold bg-sky-200">Temperatura máxima (°C)</td>
                <td className="py-2 px-6 text-left">{loading1 ? "Cargando..." : Math.round(weather1?.daily.temperature_2m_max?.[0] ?? 0)}</td>
                <td className="py-2 px-6 text-left">{loading2 ? "Cargando..." : Math.round(weather2?.daily.temperature_2m_max?.[0] ?? 0)}</td>
              </tr>
              <tr className="border-t border-sky-200 hover:bg-blue-100 transition-colors cursor-default">
                <td className="py-2 px-6 text-left font-semibold bg-sky-200">Temperatura mínima (°C)</td>
                <td className="py-2 px-6 text-left">{loading1 ? "Cargando..." : Math.round(weather1?.daily.temperature_2m_min?.[0] ?? 0)}</td>
                <td className="py-2 px-6 text-left">{loading2 ? "Cargando..." : Math.round(weather2?.daily.temperature_2m_min?.[0] ?? 0)}</td>
              </tr>
              <tr className="border-t border-sky-200 hover:bg-blue-100 transition-colors cursor-default">
                <td className="py-2 px-6 text-left font-semibold bg-sky-200">Prob. de Precipitación (%)</td>
                <td className="py-2 px-6 text-left">
                  {loading1 ? "Cargando..." : formatValue(weather1?.daily.precipitation_probability_max?.[0], "%")}
                </td>
                <td className="py-2 px-6 text-left">
                  {loading2 ? "Cargando..." : formatValue(weather2?.daily.precipitation_probability_max?.[0], "%")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

