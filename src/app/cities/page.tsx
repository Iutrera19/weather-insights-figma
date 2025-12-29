import Image from "next/image";
import { Inter } from "next/font/google";
import { CityDetailsSearch } from "@/components/city-details-search";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
});

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