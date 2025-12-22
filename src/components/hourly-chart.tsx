'use client';

import { Droplets } from 'lucide-react';

type HourlyWeatherData = {
  hourly: {
    time: Date[];
    temperature_2m?: Float32Array;
    precipitation_probability?: Float32Array | null;
  };
};

type Props = {
  data: HourlyWeatherData;
  hours?: number;
};

export const HourlyWeatherRow = ({ data, hours = 24 }: Props) => {
  const items = data.hourly.time
    .slice(0, hours)
    .map((time, index) => ({
      time,
      temperature: Number(data.hourly.temperature_2m?.[index].toFixed(1)),
      precipitation: Math.round(
        data.hourly.precipitation_probability?.[index] ?   data.hourly.precipitation_probability?.[index] : 0
      ),
    }));

  const formatHour = (time: string | Date) => {
    const date = time instanceof Date ? time : new Date(time);
    return `${date.getHours().toString().padStart(2, '0')}:00`;
  };

  return (
    <div className="overflow-x-auto py-4 w-full">
      <h1 className="text-2xl font-semibold text-sky-600 mb-2">Hora a hora</h1>
      <div className="flex gap-3 px-1">
        {items.map((item, index) => (
          <div
            key={index}
            className="min-w-[80px] bg-white rounded-lg border border-gray-200 shadow-sm px-3 py-4 text-center
                      hover:bg-blue-100 transition-colors"
          >
            <div className="text-xs text-gray-500 mb-1">
              {formatHour(item.time)}
            </div>

            <div className="text-base font-semibold text-gray-800">
              {item.temperature}°C
            </div>

            <div className="flex flex-row text-sky-600 font-semibold text-sm justify-center">
              <Droplets size={16} />
              {item.precipitation}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
