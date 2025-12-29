"use client"

import axios from "axios";
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

type Country = {
  iso2: string;
  name: string;
  long: number;
  lat: number;
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
  };
  error?: boolean;
};

export const CountryCard = ({ country }: { country: Country }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.post('http://localhost:3001/cities/weather', {
          latitude: country.lat,
          longitude: country.long,
        });

        const data: WeatherForecast = res.data.weather;

        if (!data.current || !data.daily || data.error) {
          throw new Error("Invalid weather data");
        }

        setForecast(data);
      } catch {
        setError("Error al cargar el pronóstico");
        setForecast(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [country]);
  
  const weatherLabel = forecast
    ? stringifyWeatherCode(forecast.current.weather_code, forecast.current.precipitation_probability)
    : null;

return (
  <div className="relative max-w-full min-w-[290px] flex-1 flex flex-col flex-grow basis-1/5 rounded-[10px] overflow-hidden border border-white/5 card-bg gap-[24px]">
    {/* BACKGROUND IMAGE */}
    <div
      className="absolute inset-0 bg-cover bg-center opacity-20 rounded-[10px]"
      style={{
        backgroundImage: `url(${parseWeatherCode(
          (forecast && !forecast.error) ? forecast.current.weather_code : 0, (forecast && !forecast.error) ? forecast.current.precipitation_probability : 0
        )})`,
      }}
    />

    <div className="relative z-10 flex flex-col p-[16px] gap-[24px] w-full h-full justify-center">
      <div className="flex flex-row h-full">
        <div className="min-w-[80px] h-[60px] flex justify-start">
            <Image src={`https://flagcdn.com/${country.iso2.toLowerCase()}.svg`} alt="country flag" width={60} height={60} 
              className="rounded-full"/>
        </div>

        <div className="flex flex-col gap-[9px] h-full w-full justify-start">
          <h1 className={`font-semibold text-lg ${inter.className}`}>{country.name}</h1>
          <div className="flex flex-row items-center gap-[4px]">
            <TbTemperature
              style={{
                color: parseTemperature(
                  (forecast && !forecast.error) ? forecast.current.temperature_2m : 15
                ),
              }}
            />
            <p className={`${inter.className} text-sm`}>
              {forecast
                ? `${forecast.current.temperature_2m.toFixed(1)}°`
                : loading ? "Cargando..." : "No Disponible"}
            </p>
          </div>

          <div className="flex flex-row items-center gap-[6px]">
            {/* ICONO */}
            {weatherLabel === "Soleado" && (
              <BsSun className="text-yellow-400" />
            )}

            {weatherLabel === "Lluvioso" && (
              <BsCloudRain className="text-blue-400" />
            )}

            {weatherLabel === "Seminublado" && (
              <BsCloudSun className="text-white-400" />
            )}

            {weatherLabel === "Tormenta" && (
              <AiOutlineThunderbolt className="text-purple-400" />
            )}
            <p className={`${inter.className} text-sm`}>
              {weatherLabel ? weatherLabel : loading ? "Cargando..." : "No disponible"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-[2px]">
        <Link href={`/cities/?countryName=${encodeURIComponent(country.name)}&countryCode=${encodeURIComponent(country.iso2)}`} className={`${inter.className}`}>Ver {">"}</Link>
      </div>
    </div>
  </div>
);

}