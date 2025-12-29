import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Fredoka } from 'next/font/google'
import Image from "next/image";
import Link from "next/link";

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['400'],
});

export const metadata: Metadata = {
  title: "üweather",
  description: "üweather weather application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <html lang="en" className="w-full h-full">
    <body className="w-full h-full overflow-y-auto global-bg">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/cielo.jpg')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-[url('/ruido-colores.jpg')] bg-cover bg-center bg-no-repeat opacity-50" />
      </div>
      <div className="min-h-screen flex justify-center">
        <div
          className="w-full px-[7px] py-[9px] rounded-[10px] flex flex-col">
          <div className="fondo rounded-[10px] flex flex-col h-full border-1 border-white/20">
          <header className="flex items-center rounded-t-[10px] justify-center gap-[6px] px-[93px] py-[5px] h-[93px]">
            <Link href="/" className="flex items-center justify-center gap-[6px] px-[93px] py-[5px] h-[93px]">
              <Image
                src="/uw_logo.svg"
                alt="üweather logo"
                width={34.39}
                height={25.57}
              />
              <span
                className={`text-[27px] font-normal leading-none text-white ${fredoka.className}`}
              >
                üweather
              </span>
            </Link>
          </header>
          <div className="gap-[38px] frame1 max-h-full flex flex-col items-center md:frame1-phone rounded-b-[10px] w-full h-full px-[20px] pt-[54px] pb-[40px]">
            {children}
          </div>
          </div>
        </div>
      </div>

    </body>
  </html>


  );
}
