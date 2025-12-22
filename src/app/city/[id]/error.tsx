"use client"

import Link from "next/link";

export default function Error() {
  return (<>
    <h1 className="text-red-600 font-semibold">Error al cargar los detalles de la ciudad.</h1>
    <Link href="/" className="text-sky-600 underline mt-4 inline-block">Volver a la página principal</Link>
  </>)
}