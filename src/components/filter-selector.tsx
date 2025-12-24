import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const FilterSelector = ({filter, onFilterChange}: {filter: string, onFilterChange: (filter: string) => void}) => {
  const optionsArray = ["Todos", "Soleado", "Seminublado", "Lluvioso", "Tormenta"];
  return (
    <div className="flex flex-row h-[40px] border-1 border-white/20 gap-[20px] py-[2px] pl-[2px] pr-[16px] rounded-[5px] overflow-x-auto justify-center items-center">
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
    </div>
  )
}