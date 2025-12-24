import { Inter } from "next/font/google";
import { ScrollShadow } from "@heroui/react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const FilterSelector = ({filter, onFilterChange}: {filter: string, onFilterChange: (filter: string) => void}) => {
  const optionsArray = ["Todos", "Soleado", "Seminublado", "Lluvioso", "Tormenta"];
  return (
    <ScrollShadow size={300} orientation="horizontal" hideScrollBar className="flex h-[40px] items-center gap-[20px]
                 rounded-[5px] py-[2px] pl-[2px] pr-[16px]
                 md:border md:border-white/20 no-scrollbar">
    {/* <div className="flex flex-row h-[40px] md:border-1 md:border-white/20 gap-[20px] py-[2px] pl-[2px] pr-[16px] rounded-[5px] overflow-x-auto justify-start items-center no-scrollbar"> */}
        {optionsArray.map((item) => (
        <div
          key={item}
          className={`flex items-center justify-center px-[8px] gap-[10px] shrink-0 ${filter === item ? "filter-bg" : ""} rounded-[5px] cursor-pointer h-full`}
          onClick={() => onFilterChange(item)}
        >
          <p className={`${inter.className} text-white text-sm whitespace-nowrap`}>
            {item}
          </p>
        </div>
      ))}
    {/* </div> */}
    </ScrollShadow>
  )
}