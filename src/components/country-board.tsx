"use client"

import { CountryCard } from "./country-card";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

type Country = {
  iso2: string;
  name: string;
  long: number;
  lat: number;
}

export const CountryBoard = ({ countries, loading}: {countries: Country[], loading: boolean}) => {

  // const [selectedCity, setSelectedCity] = useState<City | null>(null);

  if (loading) {
    return (<>
        <div className="error-bg flex flex-col h-full w-full rounded-[10px] gap-[23px] justify-center items-center">
            <AiOutlineLoading3Quarters className="text-white animate-spin" size={48} />
        </div>
      </>
    );
  }
  if (!countries.length || countries.length === 0) {
    return <p className="text-white">No se encontraron países</p>
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-[16px] w-full md:px-[20px]">
      {countries.map((country) => (
        <CountryCard
          key={country.iso2}
          country={country}
        />
      ))}
    </div>
  );
}