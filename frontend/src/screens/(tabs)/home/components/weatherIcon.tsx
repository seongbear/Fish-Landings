import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Waves } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

interface WeatherIconProps {
  code: number;           // Open-Meteo weather code
  size?: number;
  color?: string;
}

export function WeatherIcon({ code, size = 90, color = '#fff' }: WeatherIconProps) {
  let IconComponent: React.ComponentType<any> = Sun; // default icon

  const codeMap: { [key: number]: React.ComponentType<any> } = {
    0: Sun,
    1: Sun,
    2: Cloud,
    3: Cloud,
    45: Cloud,
    48: Cloud,
    51: CloudRain,
    53: CloudRain,
    55: CloudRain,
    56: CloudRain,
    61: CloudRain,
    63: CloudRain,
    65: CloudRain,
    66: CloudRain,
    67: CloudRain,
    71: Cloud,
    73: Cloud,
    75: Cloud,
    77: Cloud,
    80: CloudRain,
    81: CloudRain,
    82: CloudRain,
    85: Cloud,
    86: Cloud,
    95: CloudRain,
    96: CloudRain,
    99: CloudRain,
  };

  if (codeMap[code]) {
    IconComponent = codeMap[code];
  }

  return <IconComponent color={color} size={size} style={{ marginLeft: 'auto', opacity: 0.8 }} />;
}
