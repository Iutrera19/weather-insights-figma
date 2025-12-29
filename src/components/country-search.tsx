"use client"

import { useState, useEffect } from "react";
import { CountryBoard } from "./country-board";
import Image from "next/image";
import { Search } from "lucide-react";

type Country = {
  iso2: string;
  name: string;
  long: number;
  lat: number;
}

export const CountrySearch = () => {
    const [countryName, setCountryName] = useState("");
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSearch(value: string) {
        setCountryName(value);
        setError(null);

        if (value.trim().length < 1) {
            setCountries([]);
            setError("Escribe el nombre de un país.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`http://localhost:3001/countries?name=${encodeURIComponent(value)}`);

            if (!res.ok) {
                throw new Error("Error al buscar países");
            }

            const response = await res.json();

            if (response.error) {
                setError("Error de búsqueda de países");
                setCountries([]);
                return;
            }

            setCountries(response.countries);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error inesperado"
            );
            setCountries([]);
        } finally {
            setLoading(false);
        }
    }
    
    async function formSubmit(e: React.FormEvent) {
      e.preventDefault();
      await handleSearch(countryName);
    }


    return (
        <div className="flex flex-col items-center justify-start gap-[38px] w-full h-full">
            <div className="flex flex-row max-w-[346px] h-[40px] gap-[9px] items-center">
                <form onSubmit={formSubmit} className="flex flex-row text-white w-[315px] border-1 border-bluish-100 rounded-[5px] gap-[8px] pl-[10px] max-w-full h-full">
                <button
                    type="submit"
                    disabled={loading}
                >
                    {/* {loading ? "Buscando..." : "Buscar"} */}
                        <Search size={18} color="var(--color-bluish-100)" />

                </button>
                <input
                    placeholder="Buscar..."
                    value={countryName}
                    onChange={(e) => setCountryName(e.target.value)}
                    className="placeholder:text-white/85 max-w-full"
                />
                </form>
                <span title="Escribe el nombre de la ciudad y revisa su clima">
                  <Image src="/help-circle.svg" alt="help icon" width={24} height={24} />
                </span>
            </div>

            {error && (
                <p className="text-red-600 font-medium">{error}</p>
            )}

            <CountryBoard
                countries={countries}
                loading={loading}
            />
        </div>
    );
};
