type WeatherData = {
  current: {
    time: Date;
    temperature_2m: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
  daily: {
    time: Date[];
    temperature_2m_max?: Float32Array;
    temperature_2m_min?: Float32Array;
    precipitation_probability_max?: Float32Array | null;
  };
};

export const CityResume = ({weatherData}: {weatherData: WeatherData}) => {
  return (
    <section className="space-y-6 flex flex-col items-center">
      <div className="flex flex-row gap-6 w-full max-w-5xl">
        
        {/* Clima actual */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 w-full max-w-sm">
          <h2 className="text-lg font-semibold text-sky-600 mb-4">
            Clima actual
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Fecha</p>
              <p className="font-medium">
                {weatherData.current.time.toLocaleDateString('es-ES', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                })}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Viento</p>
              <p className="font-medium">
                {weatherData.current.wind_speed_10m} km/h
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Temperatura</p>
              <p className="font-medium">
                {weatherData.current.temperature_2m} °C
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Dirección viento</p>
              <p className="font-medium">
                {weatherData.current.wind_direction_10m}°
              </p>
            </div>
          </div>
        </div>

        {/* Pronóstico diario */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 w-full">
          <h2 className="text-lg font-semibold text-sky-600 mb-4">
            Pronóstico próximos días
          </h2>

          <div className="space-y-3">
            {weatherData.daily.time.slice(2, 4).map((date, index) => (
              <div
                key={date.toISOString()}
                className="grid grid-cols-4 gap-4 py-3 border-t border-gray-200 transition-colors"
              >
                <div>
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="font-medium">
                    {date.toLocaleDateString('es-ES', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Máx</p>
                  <p className="font-medium">
                    {weatherData.daily.temperature_2m_max?.[index]} °C
                  </p>
                </div>
                    
                <div>
                  <p className="text-sm text-gray-500">Mín</p>
                  <p className="font-medium">
                    {weatherData.daily.temperature_2m_min?.[index]} °C
                  </p>
                </div>

                <div>
                  <p className="text-sky-600 font-semibold text-sm">Lluvia</p>
                  <p className="text-sky-600 font-semibold text-sm">
                    {weatherData.daily.precipitation_probability_max?.[index]} %
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}