import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const FilterSelector = () => {
  return (
    <div className="flex flex-row h-[40px] border-1 border-white/20 gap-[20px] py-[2px] pl-[2px] pr-[16px] rounded-[5px] overflow-x-auto">
        <div className="h-full flex flex-row items-center justify-center px-[8px] gap-[10px]">
            <p className={`${inter.className} text-white text-sm`}>Todos</p>
        </div>
        <div className="h-full flex flex-row items-center justify-center px-[8px] gap-[10px]">
            <p className={`${inter.className} text-white text-sm`}>Soleado</p>
        </div>
        <div className="h-full flex flex-row items-center justify-center px-[8px] gap-[10px]">
            <p className={`${inter.className} text-white text-sm`}>Seminublado</p>
        </div>
        <div className="h-full flex flex-row items-center justify-center px-[8px] gap-[10px]">
            <p className={`${inter.className} text-white text-sm`}>Lluvioso</p>
        </div>
        <div className="h-full flex flex-row items-center justify-center px-[8px] gap-[10px]">
            <p className={`${inter.className} text-white text-sm`}>Tormenta</p>
        </div>
    </div>
  )
}