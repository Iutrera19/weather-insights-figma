"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Droplets } from "lucide-react";

type City = {
  id: number;
  country?: string;
  latitude: number;
  longitude: number;
  name: string;
  timezone: string;
};

type WeatherForecast = {
  current: {
    temperature_2m: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
};

export const WeatherOverlay = ({
  city,
  onClose,
}: {
  city: City;
  onClose: () => void;
}) => {
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/city-weather?latitude=${city.latitude.toFixed(
            2
          )}&longitude=${city.longitude.toFixed(2)}`
        );

        if (!res.ok) {
          throw new Error("Weather API error");
        }

        const data: WeatherForecast = await res.json();

        if (!data.current || !data.daily) {
          throw new Error("Invalid weather data");
        }

        setForecast(data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar el pronóstico");
        setForecast(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  if (error) {
    return (
      <div className="fixed inset-0 bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6 relative">
        <p className="text-center text-red-500 font-medium">{error}</p>
      </div>
    </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-sky-600 font-bold text-xl focus:outline-none"
          aria-label="Cerrar"
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold text-sky-600 mb-2">
          Pronóstico para {city.name} - {city.country}
        </h2>
        <h3 className="text-sm text-gray-500 mb-6">
          Zona horaria: {city.timezone.replace("_", " ")}
        </h3>

        {loading && (
          <p className="text-center text-gray-500">
            Cargando pronóstico...
          </p>
        )}

        {error && (
          <p className="text-center text-red-500 font-medium">{error}</p>
        )}

        {forecast?.current && forecast?.daily && !loading && !error && (
          <>
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-sky-600 mb-2">
                Tiempo actual
              </h3>
              <p className="mb-1">
                Temperatura:{" "}
                <span className="font-medium">
                  {forecast.current.temperature_2m.toFixed(1)}°C
                </span>
              </p>
              <p className="mb-1">
                Velocidad del viento:{" "}
                <span className="font-medium">
                  {Math.round(forecast.current.wind_speed_10m)} km/h
                </span>
              </p>
              <p>
                Dirección del viento:{" "}
                <span className="font-medium">
                  {Math.round(forecast.current.wind_direction_10m)}°
                </span>
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-semibold text-sky-600 mb-3">
                Pronóstico 7 días
              </h3>
              <ul className="flex overflow-x-auto space-x-4">
                {forecast.daily.time.map((date, index) => (
                  <li
                    key={date}
                    className="min-w-[100px] bg-sky-50 rounded-md p-3 shadow-sm text-center flex-shrink-0"
                  >
                    <strong className="block text-sm mb-1 text-sky-700">
                      {new Date(date).toLocaleDateString("es-ES", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </strong>
                    <div className="text-gray-700 text-xs mb-1">
                      Máx:{" "}
                      <span className="font-semibold">
                        {forecast.daily.temperature_2m_max[index].toFixed(1)}°C
                      </span>
                      <br />
                      Mín:{" "}
                      <span className="font-semibold">
                        {forecast.daily.temperature_2m_min[index].toFixed(1)}°C
                      </span>
                    </div>
                    <div className="flex flex-row text-sky-600 font-semibold text-sm justify-center">
                      <Droplets size={17} />
                      {forecast.daily.precipitation_probability_max[index]}%
                    </div>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500">
                *Utilizando zona horaria automática para la obtención de
                resultados
              </p>
            </section>

            <section>
              <Link
                href={`/city/${city.id}`}
                className="inline-block mt-4 px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition-colors"
              >
                Ver detalles
              </Link>
            </section>
          </>
        )}
      </div>
    </div>
  );
};
