export interface NVRGroup {
  nvr_ip: string;
  nvr_id: string;
  devices: Device[];
  channels: Channel[];
  nvr_health?: NVRHealth;
}

export interface Device {
  device_id: string;
  device_ip?: string;
  location_name: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  nvr_ip: string;
  nvr_health?: NVRHealth;
}

export interface Channel {
  channel_id: string;
  name: string;
  online: boolean;
  recording: boolean;
  bitrate: number;
  signal: boolean;
}

export interface NVRHealth {
  working?: {
    ChanStatus: any[];
  };
  error?: string;
}