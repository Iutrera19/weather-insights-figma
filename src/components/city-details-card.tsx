"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { parseWeatherCode, parseTemperature, stringifyWeatherCode } from "@/utils/weatherParsing";
import { TbTemperature } from "react-icons/tb";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { BsCloudRain, BsCloudSun } from "react-icons/bs";
import { BsSun } from "react-icons/bs";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
});

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

type WeatherForecast = {
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
    weather_code: number[];
  };
};

export const CityDetailsCard = ({ city }: { city: City }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [weather, setWeather] = useState<string | null>(null);
  const [temperatureRange, setTemperatureRange] = useState<number | null>(null);
  
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
        setError("Error al cargar el pronóstico");
        setForecast(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);
  
  const weatherLabel = forecast
    ? stringifyWeatherCode(forecast.current.weather_code, forecast.current.precipitation_probability)
    : null;

  const weatherLabels = Array.from(forecast?.daily.weather_code ?? []).map(
  (code, index) =>
    stringifyWeatherCode(
      code,
      forecast?.daily.precipitation_probability_max[index] ?? 0
    )
);

return (
  <div className={`relative w-[304px] rounded-[10px] border border-white/5 card-bg gap-[24px] p-[16px] ${inter.className}`}>
  <div
      className="absolute inset-0 bg-cover bg-center opacity-20 rounded-[10px]"
      style={{
        backgroundImage: `url(${parseWeatherCode(
          forecast ? forecast.current.weather_code : 0, forecast ? forecast.current.precipitation_probability : 0
        )})`,
      }}
    />
  
    <div className="relative z-10 flex flex-col gap-[9px] w-[272px] h-full">
      <div className="flex flex-col justify-center items-center gap-[3px] h-[43px] w-full">
        <h1 className="font-semibold text-lg">{city.name}</h1>
        <h2 className="text-[10px]">PRONÓSTICO PARA 5 DÍAS</h2>
      </div>
      <div className="flex flex-col gap-[4px]">
        {forecast && forecast.daily.time.slice(0, 5).map((date, index) => (
          <div key={date} className={`flex flex-row px-[4px] gap-[9px] w-full ${index > 0 ? "border-t border-white/20 pt-[4px]" : ""}`}>
            {/* {index > 0 && <div className="border-2"></div>} */}
            <p className="text-sm font-semibold flex flex-grow">{index === 0 ? "Hoy" : (new Date(date)).toLocaleDateString('es-ES', {
              weekday: 'short',
            }).charAt(0).toUpperCase() + (new Date(date)).toLocaleDateString('es-ES', {
              weekday: 'short',
            }).slice(1)}
            </p>
            <div className="flex flex-row flex-grow justify-end items-center gap-[4px] w-[70px] h-full">
              {weatherLabel === "Soleado" && (
                <BsSun className="text-yellow-400" />
              )}
  
              {weatherLabel === "Lluvioso" && (
                <BsCloudRain className="text-blue-400" />
              )}
  
              {weatherLabel === "Tormenta" && (
                <AiOutlineThunderbolt className="text-purple-400" />
              )}

              {weatherLabel === "Seminublado" && (
                <BsCloudSun className="text-blue-400" />
              )}
              <p className={`${inter.className} text-sm flex justify-end`}>
                {weatherLabel ?? "Cargando..."}
              </p>
            </div>
            <div className="flex flex-row w-[43px] h-full gap-[4px]">
              <TbTemperature
                style={{
                  color: parseTemperature(
                    forecast ? forecast.daily.temperature_2m_max[index] : 15
                  ),
                }}
              />
              <p className={`${inter.className} text-sm`}>
                {forecast
                  ? `${Math.round(forecast.daily.temperature_2m_max[index])}°`
                  : "Cargando..."}
              </p>
            </div>
            </div>
        ))}
      </div>
    </div>
  </div>
);

}