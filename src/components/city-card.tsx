"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { parseWeatherCode, parseTemperature, stringifyWeatherCode } from "@/utils/weatherParsing";
import { TbTemperature } from "react-icons/tb";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { BsCloudRain } from "react-icons/bs";
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
};

export const CityCard = ({ city }: { city: City }) => {
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

return (
  <div className="relative w-[290px] rounded-[10px] overflow-hidden border border-white/5 card-bg gap-[24px]">
    
    {/* BACKGROUND IMAGE */}
    <div
      className="absolute inset-0 bg-cover bg-center opacity-20"
      style={{
        backgroundImage: `url(${parseWeatherCode(
          forecast ? forecast.current.weather_code : 0, forecast ? forecast.current.precipitation_probability : 0
        )})`,
      }}
    />

    <div className="relative z-10 flex flex-col p-[16px] gap-[24px]">
      <div className="flex flex-row">
        <div className="w-[80px] h-[60px] flex justify-start">
          <Image src="/CL.svg" alt="help icon" width={60} height={60} />
        </div>

        <div className="flex flex-col gap-[9px] h-[80px]">
          <h1 className={`font-semibold text-lg ${inter.className}`}>{city.name} - {city.country}</h1>

          <div className="flex flex-row items-center gap-[4px]">
            <TbTemperature
              style={{
                color: parseTemperature(
                  forecast ? forecast.current.temperature_2m : 15
                ),
              }}
            />
            <p className={`${inter.className} text-sm`}>
              {forecast
                ? `${forecast.current.temperature_2m}°`
                : "Cargando..."}
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

            {weatherLabel === "Tormenta" && (
              <AiOutlineThunderbolt className="text-purple-400" />
            )}
            <p className={`${inter.className} text-sm`}>
              {weatherLabel ?? "Cargando..."}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-[2px]">
        <Link href={`/city/${city.id}`} className={`${inter.className}`}>Ver {">"}</Link>
      </div>
    </div>
  </div>
);

}