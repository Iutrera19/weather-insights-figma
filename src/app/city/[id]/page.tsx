import { getCityById } from "@/actions/city";
// import { useEffect, useState } from "react";
import { getCityWeather, getHourlyWeather } from "@/actions/city";
import { CityResume } from "@/components/city-resume";
import { HourlyWeatherRow } from "@/components/hourly-chart";

type HourlyWeatherData = {
  hourly: {
    time: Date[];
    temperature_2m?: Float32Array;
    precipitation_probability?: Float32Array | null;
  };
};

type WeatherData = {
  current: {
    time: Date;
    temperature_2m: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    weather_code: number;
    precipitation_probability: number;
  };
  daily: {
    time: Date[];
    temperature_2m_max?: Float32Array;
    temperature_2m_min?: Float32Array;
    precipitation_probability_max?: Float32Array | null;
  };
};

export default async function CityDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const city = await getCityById(id);

  let weatherData: WeatherData;
  let hourlyData: HourlyWeatherData;

  try {
    weatherData = await getCityWeather(city.latitude, city.longitude);
    hourlyData = await getHourlyWeather(city.latitude, city.longitude);
  } catch (error) {
    console.error("Error obteniendo datos del clima para la ciudad:", error);
    return (
      <div className="flex flex-col items-center space-y-4 max-w-1/2">
        <p className="text-red-500">Error obteniendo información del pronóstico</p>
      </div>
    );
  }

  return (
      <>
        <div className="flex flex-col items-center space-y-4 max-w-1/2">
          <h1 className="max-w-1/1 text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50 text-2xl font-semibold text-sky-600 mb-2">{`Detalles para ${city.name} - ${city.country}`}</h1>
          <CityResume weatherData={weatherData} />
          <HourlyWeatherRow data={hourlyData} />
        </div>
      </>
    );
}