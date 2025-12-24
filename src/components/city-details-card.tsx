    "use client"

    import { useState, useEffect } from "react";
    import { parseWeatherCode, parseTemperature, stringifyWeatherCode } from "@/utils/weatherParsing";
    import { TbTemperature } from "react-icons/tb";
    import { AiOutlineThunderbolt } from "react-icons/ai";
    import { BsCloudRain, BsCloudSun } from "react-icons/bs";
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
    country_code: string;
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
        weather_code: number[];
    };
    error?: boolean;
    };

    export const CityDetailsCard = ({ city }: { city: City }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [forecast, setForecast] = useState<WeatherForecast | null>(null);

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

            if (!res.ok) throw new Error("Weather API error");

            const data: WeatherForecast = await res.json();
            setForecast(data);
        } catch {
            setError("Error al cargar el pronóstico");
            setForecast(null);
        } finally {
            setLoading(false);
        }
        };

        fetchWeather();
    }, [city]);

    let weatherLabel: string | null = null;

    if (!forecast?.error){
        weatherLabel = forecast
            ? stringifyWeatherCode(
                forecast.current.weather_code,
                forecast.current.precipitation_probability
            )
            : null;
    }

    return (
        <div className={`flex flex-grow basis-1/5    max-w-full relative rounded-[10px] border border-white/5 card-bg p-[16px] ${inter.className}`}>
        
        {/* BACKGROUND */}
        <div
            className="absolute inset-0 bg-cover bg-center opacity-20 rounded-[10px]"
            style={{
            backgroundImage: `url(${parseWeatherCode(
                forecast && !forecast.error ? forecast.current.weather_code : 0,
                forecast && !forecast.error ? forecast.current.precipitation_probability : 0
            )})`,
            }}
        />

        <div className="relative z-10 flex flex-col gap-[9px] w-full h-full">
            
            {/* HEADER */}
            <div className="flex flex-col justify-center items-center gap-[3px] h-[43px]">
            <h1 className="font-semibold text-lg">{city.name}</h1>
            <h2 className="text-[10px]">PRONÓSTICO PARA 5 DÍAS</h2>
            </div>

            {/* LISTA */}
            <div className="flex flex-col gap-[4px]">
            {((forecast && !forecast.error) ? forecast.daily.time.slice(0, 5) : Array(5).fill(null))
                .map((date, index) => (
                <div
                    key={index}
                    className={`flex flex-row px-[4px] gap-[9px] w-full ${
                    index > 0 ? "border-t border-white/20 pt-[4px]" : ""
                    }`}
                >
                    {/* DÍA */}
                    <p className="text-sm font-semibold flex flex-grow">
                    {(forecast && !forecast.error)
                        ? index === 0
                        ? "Hoy"
                        : new Date(date!).toLocaleDateString("es-ES", {
                            weekday: "short",
                            }).replace(/^./, c => c.toUpperCase())
                        : (forecast?.error) ? "Error" : "Cargando..."}
                    </p>

                    {/* CLIMA */}
                    <div className="flex flex-row flex-grow justify-end items-center gap-[4px] w-[70px]">
                    {!loading && weatherLabel === "Soleado" && <BsSun className="text-yellow-400" />}
                    {!loading && weatherLabel === "Lluvioso" && <BsCloudRain className="text-blue-400" />}
                    {!loading && weatherLabel === "Tormenta" && <AiOutlineThunderbolt className="text-purple-400" />}
                    {!loading && weatherLabel === "Seminublado" && <BsCloudSun className="text-blue-400" />}

                    <p className="text-sm">
                        {(weatherLabel && !forecast?.error) ? weatherLabel : (forecast?.error && !loading) ? "No Disponible" : "Cargando..."}
                    </p>
                    </div>

                    {/* TEMPERATURA */}
                    <div className="flex flex-row w-[43px] gap-[4px]">
                    <TbTemperature
                        style={{
                        color: parseTemperature(
                            (forecast && !forecast.error)
                            ? forecast.daily.temperature_2m_max[index]
                            : 15
                        ),
                        }}
                    />
                    <p className="text-sm">
                        {(forecast && !forecast.error)
                        ? `${Math.round(
                            forecast.daily.temperature_2m_max[index]
                            )}°`
                        : "..."}
                    </p>
                    </div>
                </div>
                ))}
            </div>
        </div>
        </div>
    );
    };
