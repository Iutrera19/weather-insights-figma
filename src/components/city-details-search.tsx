"use client"

import { useState } from "react";
import { CityBoard } from "./city-board";
import Image from "next/image";
import { Search } from "lucide-react";
import { FilterSelector } from "./filter-selector";
import { Inter } from "next/font/google";
import { CityDetailsBoard } from "./city-details-board";

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
  error?: boolean;
  reason?: string;
  timezone: string;
  country_code: string;
}

export const CityDetailsSearch = () => {
  const [cityName, setCityName] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(value: string) {
    setCityName(value);
    setError(null);

    if (value.trim().length < 1) {
      setCities([]);
      setError("Escribe el nombre de una ciudad.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/cities?cityName=${encodeURIComponent(value)}`);

      if (!res.ok) {
        throw new Error("Error al buscar ciudades");
      }

      const response = await res.json();

      if (response.error) {
        setError(response.reason);
        setCities([]);
        return;
      }

      setCities(response.cities);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error inesperado"
      );
      setCities([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-row justify-between gap-[38px] w-full flex-wrap">
        <div className="flex flex-row gap-[24px] flex-wrap">
          <div className="flex flex-row gap-[8px] items-center">
            {/* <Image src={`https://flagcdn.com/${countryCode.toLowerCase()}.svg`} alt="help icon" width={24} height={24} className="rounded-full"/> */}
            <Image src={`/CL.svg`} alt="help icon" width={24} height={24} className="rounded-full"/>
            <p className={`text-white ${inter.className}`}>{"Chile"}</p>
          </div>
          <FilterSelector />
        </div>
        <div className="flex flex-row w-[346px] h-[40px] gap-[9px]">
        <div className="flex flex-row text-white w-[315px] border-1 border-bluish-100 rounded-[5px] gap-[8px] pl-[10px] w-full">
          <button onClick={() => handleSearch(cityName)}
          disabled={loading}
          >
          {/* {loading ? "Buscando..." : "Buscar"} */}
          <Search size={18} color="var(--color-bluish-100)" />
          </button>
          <input
          placeholder="Buscar..."
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          className="placeholder:text-white/85 w-full"
          />
        </div>
        </div>
      </div>

      {error && (
        <p className="text-red-600 font-medium">{error}</p>
      )}

      <CityDetailsBoard
        cities={cities}
        loading={loading}
      />
    </>
  );
};
