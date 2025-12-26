"use client"

import { CityCard } from "./city-card";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

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

export const CityBoard = ({ cities, loading}: {cities: City[], loading: boolean}) => {

  // const [selectedCity, setSelectedCity] = useState<City | null>(null);

  if (loading) {
    return (<>
        <div className="error-bg flex flex-col h-full w-full rounded-[10px] gap-[23px] justify-center items-center">
            <AiOutlineLoading3Quarters className="text-white animate-spin" size={48} />
        </div>
      </>
    );
  }
  if (!cities.length || cities.length === 0) {
    return <p className="text-white">No se encontraron ciudades</p>
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-[16px] w-full md:px-[20px]">
      {cities.map((city) => (
        <CityCard
          key={city.id}
          city={city}
        />
      ))}
    </div>
  );
}