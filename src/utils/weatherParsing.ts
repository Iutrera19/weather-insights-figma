export function parseWeatherCode(code: number, rainProbability: number): string {
 
  if (95 <= code && code <= 99) {
    return "/tormenta.jpg";
  } 
  if (rainProbability >= 20) {
    return "/lluvioso.jpg";
  }
  if ((51 <= code && code <= 67) || (80 <= code && code <= 82)) {
    return "/lluvioso.jpg";
  } 
  return "/soleado.jpg";
}

export function stringifyWeatherCode(code: number, rainProbability: number): string {
  if (rainProbability >= 20) {
    return "Lluvioso";
  }
  if ((51 <= code && code <= 67) || (80 <= code && code <= 82)) {
    return "Lluvioso";
  } else if (95 <= code && code <= 99) {
    return "Tormenta";
  }
  return "Soleado";
}

export function parseTemperature(temperature: number): string {
  if (temperature <= 10) {
    return "rgba(153, 192, 255, 1)"; // Frío
  } else if (temperature <= 25 && temperature > 10) {
    return "rgba(223, 238, 8, 1)"; // Templado
  } else {
    return "rgba(255, 123, 75, 1)"; // Caliente
  }
}
