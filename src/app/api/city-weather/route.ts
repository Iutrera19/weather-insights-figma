export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { fetchWeatherApi } from "openmeteo";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const latitude = searchParams.get('latitude');
  const longitude = searchParams.get('longitude');
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

  try {
    const responses = await fetchWeatherApi(url, params);

    const response = responses[0];

    const currentResponse = response.current()!;
    const dailyResponse = response.daily()!;
    const utcOffsetSeconds = response.utcOffsetSeconds();


    const weatherData = {
      current: {
        time: new Date((Number(currentResponse.time()) + utcOffsetSeconds) * 1000),
        temperature_2m: currentResponse.variables(0)!.value().toFixed(1),
        wind_speed_10m: currentResponse.variables(1)!.value(),
        wind_direction_10m: currentResponse.variables(2)!.value(),
        weather_code: currentResponse.variables(3)!.value(),
        precipitation_probability: currentResponse.variables(4)!.value(),
      },
      daily: {
        time: Array.from(
          { length: (Number(dailyResponse.timeEnd()) - Number(dailyResponse.time())) / dailyResponse.interval() },
          (_, i) => new Date((Number(dailyResponse.time()) + i * dailyResponse.interval() + utcOffsetSeconds) * 1000)
        ),
        temperature_2m_max: dailyResponse.variables(0)!.valuesArray(),
        temperature_2m_min: dailyResponse.variables(1)!.valuesArray(),
        precipitation_probability_max: dailyResponse.variables(2)!.valuesArray(),
      },
    };

    return Response.json(weatherData);
  } catch (error) {
    console.error("Error obteniendo información del pronóstico:", error);
    return Response.json({ error: true, reason: "Error obteniendo información del pronóstico" });
  }
}