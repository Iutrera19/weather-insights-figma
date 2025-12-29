"use client"

import { CityDetailsCard } from "./city-details-card";

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

export const CityDetailsBoard = ({cities, loading, filter}: {cities: City[], loading: boolean, filter: string}) => {

  // const [selectedCity, setSelectedCity] = useState<City | null>(null);

  if (loading) {
    return (<>
      <p className="text-2xl font-semibold text-blue-400 mb-2">Cargando...</p>
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </>
    );
  }
  if (!cities.length || cities.length === 0) {
    return <p className="text-white">No se encontraron ciudades</p>
  }
  return (
    // <div className="justify-start flex flex-row flex-wrap gap-[16px] md:px-[20px] max-h-full w-full">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-[16px] w-full md:px-[20px]">
      {cities.map((city) => (
        <CityDetailsCard
          key={city.name + city.latitude + city.longitude}
          city={city}
          filter={filter}
        />
      ))}
    </div>
  );
}