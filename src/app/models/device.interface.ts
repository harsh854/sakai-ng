export interface Device {
  id?: string;
  deviceId: string;
  tenantId?: string;
  nvrIp: string;
  nvrId: string;
  nvrPassword: string;
  location: DeviceLocation;
  coordinates?: Coordinates;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DeviceLocation {
  state: string;
  district: string;
  address: string;
  pincode?: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationHierarchy {
  states: State[];
}

export interface State {
  name: string;
  code: string;
  districts: District[];
}

export interface District {
  name: string;
  code: string;
}

export interface LocationSuggestion {
  address: string;
  coordinates: Coordinates;
  placeId?: string;
}
