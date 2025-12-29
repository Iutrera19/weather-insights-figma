"use server";

import { fetchWeatherApi } from "openmeteo";
import axios from "axios";

export type CityApiResponse = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  timezone: string;
  country_code: string;
}

export async function getCityById(id: string) {
  if (!id) {
    throw new Error("Id de ciudad faltante");
  }

  try {
    const res = await axios.get(`https://geocoding-api.open-meteo.com/v1/get`, {
      params: { id: id }
    });
    const data = res.data;

    if (data.error) {
      throw new Error("Error obteniendo información de las ciudades");
    }
    return data as CityApiResponse;
  } catch (error) {
    console.error("Error obteniendo información de las ciudades:", error);
    throw new Error("Error obteniendo información de las ciudades");
  }
}

export async function getCityWeather(latitude: number, longitude: number) {
  const daily = ["temperature_2m_max", "temperature_2m_min", "precipitation_probability_max"];
  const current = ["temperature_2m", "wind_speed_10m", "wind_direction_10m", "weather_code", "precipitation_probability"];

  const params = {
    latitude: latitude,
    longitude: longitude,
    daily: daily,
    current: current,
    timezone: "auto",
  };

  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);

  const response = responses[0];

  const currentResponse = response.current()!;
  const dailyResponse = response.daily()!;
  const utcOffsetSeconds = response.utcOffsetSeconds();

  const weatherData = {
    current: {
      time: new Date((Number(currentResponse.time()) + utcOffsetSeconds) * 1000),
      temperature_2m: parseFloat(currentResponse.variables(0)!.value().toFixed(1)),
      wind_speed_10m: parseFloat(currentResponse.variables(1)!.value().toFixed(1)),
      wind_direction_10m: parseFloat(currentResponse.variables(2)!.value().toFixed(0)),
      weather_code: currentResponse.variables(3)!.value(),
      precipitation_probability: parseFloat(currentResponse.variables(4)!.value().toFixed(1)),
    },
    daily: {
      time: Array.from(
        { length: (Number(dailyResponse.timeEnd()) - Number(dailyResponse.time())) / dailyResponse.interval() },
        (_, i) => new Date((Number(dailyResponse.time()) + i * dailyResponse.interval() + utcOffsetSeconds) * 1000)
      ),
      temperature_2m_max: dailyResponse.variables(0)!.valuesArray()?.map(val => parseFloat(val.toFixed(0))),
      temperature_2m_min: dailyResponse.variables(1)!.valuesArray()?.map(val => parseFloat(val.toFixed(0))),
      precipitation_probability_max: dailyResponse.variables(2)!.valuesArray(),
    },
  };

  return weatherData;
}

export async function getHourlyWeather(latitude: number, longitude: number) {
  const params = {
    latitude: latitude,
    longitude: longitude,
    hourly: ["temperature_2m", "precipitation_probability"],
    forecast_days: 1,
    timezone: "auto",
  };
  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);

  const response = responses[0];
  const hourlyResponse = response.hourly()!;
  const utcOffsetSeconds = response.utcOffsetSeconds();

  const weatherData = {
    hourly: {
      time: Array.from(
        { length: (Number(hourlyResponse.timeEnd()) - Number(hourlyResponse.time())) / hourlyResponse.interval() },
        (_, i) => new Date((Number(hourlyResponse.time()) + i * hourlyResponse.interval() + utcOffsetSeconds) * 1000)
      ),
      temperature_2m: hourlyResponse.variables(0)!.valuesArray()?.map(val => parseFloat(val.toFixed(0))),
      precipitation_probability: hourlyResponse.variables(1)!.valuesArray(),
    },
  };
  return weatherData;
}
