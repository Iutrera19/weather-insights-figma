import Image from "next/image";

// import { CityList } from "@/app/cities/city-list";
import { CitySearch } from "@/components/city-search";

export default function Home() {
  return (
    <div className="frame1 rounded-b-[10px] w-full h-full px-[20px] pt-[54px] pb-[40px]">
        <CitySearch compare={false}/>
    </div>
  );
}
