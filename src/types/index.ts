export type DeviceType = "mobile" | "desktop";
export type Point = {
  lat: number;
  lng: number;
};

export type Geometry = {
  location: Point;
};

export const apiChannels = [
  "ahbap_location",
  "sicak_yemek",
  "hastahane_locations",
  "teleteyit",
  "uydu",
  "sahra_mutfak",
  "turk_eczane",
  "eczane_excel",
  "guvenli_yerler_oteller",
  "twitter",
  "teyit_enkaz",
  "babala",
  "Babala",
  "adana_yemek",
  "malatya_yemek",
  "depremio",
  "teyit_yardim",
] as const;

export type APIGenericChannelProp<
  TChannel extends (typeof apiChannels)[number]
> = {
  channel: TChannel;
};
export type APIResponseChannelProp =
  | APIGenericChannelProp<"ahbap_location">
  | APIGenericChannelProp<"sicak_yemek">
  | APIGenericChannelProp<"hastahane_locations">
  | APIGenericChannelProp<"teleteyit">
  | APIGenericChannelProp<"uydu">
  | APIGenericChannelProp<"sahra_mutfak">
  | APIGenericChannelProp<"turk_eczane">
  | APIGenericChannelProp<"eczane_excel">
  | APIGenericChannelProp<"guvenli_yerler_oteller">
  | APIGenericChannelProp<"twitter">
  | APIGenericChannelProp<"teyit_enkaz">
  | APIGenericChannelProp<"babala">
  | APIGenericChannelProp<"Babala">
  | APIGenericChannelProp<"adana_yemek">
  | APIGenericChannelProp<"malatya_yemek">
  | APIGenericChannelProp<"depremio">
  | APIGenericChannelProp<"teyit_yardim">;

export type APIChannel = APIResponseChannelProp["channel"];

export type APIResponseBody = {
  id: number;
  entry_id: number;
  reason?: string;
  extra_parameters?: string;
  full_text?: string;
  formatted_address: string;
  timestamp?: string;
  loc?: [number, number];
  lat?: number;
  lng?: number;
  is_location_verified?: boolean;
  is_need_verified: boolean;
};

export type APIResponse = APIResponseBody & APIResponseChannelProp;

export type MarkerVisited = {
  [key: number]: boolean;
};

export type EVENT_TYPES =
  | "movestart"
  | "moveend"
  | "zoomstart"
  | "zoomend"
  | "ready";
