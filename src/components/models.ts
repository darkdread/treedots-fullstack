import { CircleOverlay } from "./CircleOverlay";

export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface HubCountry {
  currency_code: string;
  currency_symbol: string;
  description: string;
  id: number;
  name: string;
}

export interface Hub {
  building: string;
  city: string;
  country: HubCountry;
  floor_number: string;
  postal_code: string;
  road: string;
  state: string;
  street_number?: any;
  unit: string;
  name: string;
  id: number;
  address_type_id?: number;
}

export interface HubsDict {
  [key: string]: HubMarker,
}

export interface HubMarker {
  dist: number,
  circle: CircleOverlay,
  marker: any,
  hub: Hub,
  label: string
}