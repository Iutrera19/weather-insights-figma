export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { getCityById } from "@/actions/city";

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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  
  try {
    const city = await getCityById(id!);

    return Response.json({ city, error: false, reason: null });
  } catch (error) {
    return Response.json({ city: null, error: true, reason: (error as Error).message });
  }
}
