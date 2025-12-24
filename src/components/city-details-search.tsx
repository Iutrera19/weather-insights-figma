"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { FilterSelector } from "./filter-selector";
import { Inter } from "next/font/google";
import { CityDetailsBoard } from "./city-details-board";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const inter = Inter({
    subsets: ["latin"],
    weight: ["300", "500", "400", "700"],
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
    const [filter, setFilter] = useState<string>("Todos");

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

    useEffect(() => {
        // filterResults(cities, filter);
    }, [filter]);

    if (error) {
        return (
            <>
                <div className="flex flex-col gap-4 w-full md:flex-row md:justify-between md:gap-[38px]">
                    <div className="flex flex-row gap-[24px] flex-wrap">
                        <div className="flex flex-row gap-[8px] items-center">
                            {/* <Image src={`https://flagcdn.com/${countryCode.toLowerCase()}.svg`} alt="help icon" width={24} height={24} className="rounded-full"/> */}
                            <Image src={`/CL.svg`} alt="help icon" width={24} height={24} className="rounded-full" />
                            <p className={`text-white ${inter.className}`}>{"Chile"}</p>
                        </div>
                        <FilterSelector filter={filter} onFilterChange={setFilter} />
                    </div>
                    <div className="flex flex-row max-w-[346px] h-[40px] gap-[9px]">
                        <div className="flex flex-row text-white w-[315px] border-1 border-bluish-100 rounded-[5px] gap-[8px] pl-[10px] max-w-full">
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
                                className="placeholder:text-white/85 max-w-full"
                            />
                        </div>
                    </div>
                </div>
                <div className="error-bg flex flex-col h-full w-full rounded-[10px] gap-[23px] justify-center items-center">
                    <Image src="/error-logo.svg" alt="error logo" width={61.71} height={48} />
                    <div className="flex flex-col gap-[6px] justify-center items-center">
                        <p className={`text-white ${inter.className} text-sm font-medium`}>Las nubes no nos dejan ver el clima de este país en este momento</p>
                        <p className={`text-white ${inter.className} text-sm font-light`}>Vuelve a conectarte a internet y lo intentaremos nuevamente</p>
                    </div>
                </div>
            </>
        )
    }

    if (loading) {
        return (
            <>
                <div className="flex flex-col gap-4 w-full md:flex-row md:justify-between md:gap-[38px]">
                    <div className="flex flex-row gap-[24px] flex-wrap">
                        <div className="flex flex-row gap-[8px] items-center">
                            {/* <Image src={`https://flagcdn.com/${countryCode.toLowerCase()}.svg`} alt="help icon" width={24} height={24} className="rounded-full"/> */}
                            <Image src={`/CL.svg`} alt="help icon" width={24} height={24} className="rounded-full" />
                            <p className={`text-white ${inter.className}`}>{"Chile"}</p>
                        </div>
                        <FilterSelector filter={filter} onFilterChange={setFilter} />
                    </div>
                    <div className="flex flex-row max-w-[346px] h-[40px] gap-[9px]">
                        <div className="flex flex-row text-white w-[315px] border-1 border-bluish-100 rounded-[5px] gap-[8px] pl-[10px] max-w-full">
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
                                className="placeholder:text-white/85 maxw-full"
                            />
                        </div>
                    </div>
                </div>
                <div className="error-bg flex flex-col h-full w-full rounded-[10px] gap-[23px] justify-center items-center">
                    <AiOutlineLoading3Quarters className="text-white animate-spin" size={48} />
                </div>
            </>
        )
    }

    return (
        <>
            <div className="flex flex-col gap-4 w-full md:flex-row md:justify-between md:gap-[38px]">
                <div className="flex flex-row gap-[24px] flex-wrap">
                    <div className="flex flex-row gap-[8px] items-center">
                        {/* <Image src={`https://flagcdn.com/${countryCode.toLowerCase()}.svg`} alt="help icon" width={24} height={24} className="rounded-full"/> */}
                        <Image src={`/CL.svg`} alt="help icon" width={24} height={24} className="rounded-full" />
                        <p className={`text-white ${inter.className}`}>{"Chile"}</p>
                    </div>
                    <FilterSelector filter={filter} onFilterChange={setFilter} />
                </div>
                <div className="flex flex-row max-w-[346px] h-[40px] gap-[9px]">
                    <div className="flex flex-row text-white w-[315px] border-1 border-bluish-100 rounded-[5px] gap-[8px] pl-[10px] max-w-full">
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
                            className="placeholder:text-white/85 max-w-full"
                        />
                    </div>
                </div>
            </div>

            <CityDetailsBoard
                cities={cities}
                loading={loading}
            />
        </>
    );
};
