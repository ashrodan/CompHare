import React from 'react';

export const OliveOilVolumeIcons = [
  {
    id: 'small-bottle',
    label: '0.5L',
    minVolume: 0,
    maxVolume: 0.5,
    icon: <span className="text-2xl">🍶</span>
  },
  {
    id: 'medium-bottle',
    label: '3L',
    minVolume: 0.5,
    maxVolume: 3,
    icon: <span className="text-3xl">🍶</span>
  },
  {
    id: 'large-bottle',
    label: '5L',
    minVolume: 3,
    maxVolume: 5,
    icon: <span className="text-3xl">🍶</span>
  },
  {
    id: 'jug',
    label: '10L',
    minVolume: 5,
    maxVolume: 10,
    icon: <span className="text-4xl">🍶</span>
  },
  {
    id: 'drum',
    label: '20L+',
    minVolume: 10,
    maxVolume: 999999,
    icon: <span className="text-4xl">🛢️</span>
  }
];

export const getVolumeIconByVolume = (volume: number) => {
  return OliveOilVolumeIcons.find(icon => 
    volume > icon.minVolume && volume <= icon.maxVolume
  ) || OliveOilVolumeIcons[0];
};
