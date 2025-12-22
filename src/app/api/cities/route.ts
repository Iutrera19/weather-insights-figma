import { NextRequest } from "next/server";

export type CityApiResponse = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  timezone: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const cityName = searchParams.get('cityName');

  if (!cityName) {
    return Response.json({ error: true, reason: "Missing cityName parameter", cities: [] });
  }

  try {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=10&language=es&format=json`);

    const jsonData = await response.json();

    if (jsonData.error) {
      return Response.json({ error: true, reason: "Error obteniendo información de las ciudades", cities: [] });
    }

    else if (!jsonData.results || jsonData.results.length === 0) {
      return Response.json({ error: false, reason: null, cities: [] });
    } else {
      const apiCities: CityApiResponse[] = jsonData.results;

      const apiCitiesSimplified = apiCities.map((city) => ({
        id: city.id,
        name: city.name,
        latitude: city.latitude,
        longitude: city.longitude,
        country: city.country,
        admin1: city.admin1,
        timezone: city.timezone,
      }));

      return Response.json({ cities: apiCitiesSimplified, error: false, reason: null });
    }
  } catch (error) {
    console.error("Error obteniendo información de las ciudades:", error);
    return Response.json({ error: true, reason: "Error obteniendo información de las ciudades", cities: [] });
  }
}