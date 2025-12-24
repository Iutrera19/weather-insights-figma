"use client"

import { useState } from "react";
import { CityBoard } from "./city-board";
import Image from "next/image";
import { Search } from "lucide-react";

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

export const CitySearch = () => {
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
        <div className="flex flex-col items-center justify-start h-full gap-[38px]">
            <div className="flex flex-row max-w-[346px] h-[40px] gap-[9px]">
                <div className="flex flex-row text-white w-[315px] border-1 border-bluish-100 rounded-[5px] gap-[8px] pl-[10px] max-w-full">
                    <button
                        onClick={() => handleSearch(cityName)}
                        disabled={loading}
                    >
                        {/* {loading ? "Buscando..." : "Buscar"} */}
                        <Search size={18} color="var(--color-bluish-100)" />
                    </button>
                    <input
                        placeholder="Buscar..."
                        value={cityName}
                        onChange={(e) => setCityName(e.target.value)}
                        className="placeholder:text-white/85 max-w-full"
                    />
                </div>
                <Image src="/help-circle.svg" alt="help icon" width={24} height={24} />
            </div>

            {error && (
                <p className="text-red-600 font-medium">{error}</p>
            )}

            <CityBoard
                cities={cities}
                loading={loading}
            />
        </div>
    );
};
