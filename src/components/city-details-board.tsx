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

export const CityDetailsBoard = ({cities, loading}: {cities: City[], loading: boolean}) => {

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
    <div className="justify-center flex flex-row flex-wrap gap-[16px] md:px-[20px] max-h-full max-h-full">
      {cities.map((city) => (
        <CityDetailsCard
          key={city.id}
          city={city}
        />
      ))}
    </div>
  );
}