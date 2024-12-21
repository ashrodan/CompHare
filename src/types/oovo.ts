export interface OOVOVolumeOption {
  volume: number; // in liters
  price: number;
}

export interface OOVOItem {
  name: string;
  location: string;
  shipping: number;
  stockStatus: string;
  link: string;
  description: string;
  volumeOptions: OOVOVolumeOption[];
}
