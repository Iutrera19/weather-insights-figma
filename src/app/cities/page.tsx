import { CityDetailsSearch } from "@/components/city-details-search";

export default async function CountryCitiesPage({
  searchParams
}: {
  searchParams: Promise<{ countryName: string, countryCode: string}>;
}) {
  const { countryName, countryCode } = await searchParams;
  return (
    <CityDetailsSearch countryCode={countryCode} countryName={countryName} />
  );
}