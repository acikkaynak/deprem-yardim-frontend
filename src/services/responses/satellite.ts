import { createGeometry } from "@/utils/geometry";
import { Geometry, APIResponseBody, APIGenericChannelProp } from "@/types";
import { parseExtraParams } from "@/services/parseExtraParams";

export type SatelliteAPIExtraParams = {
  damage: string;
  formatted_address: string;
  longitude: number;
  latitude: number;
  shape_long: string;
  shape_area: string;
};

export type SatelliteDataProperties = {
  damage: string | null;
  verified: boolean | null;
  icon: string;
  name: string | null;
  description: string | null;
};

export type SatelliteData = {
  channel: "uydu";
  properties: SatelliteDataProperties;
  geometry: Geometry;
  reference?: number | null;
  closeByRecords?: number[];
  isVisited?: boolean;
};
type SatelliteChannelProp = APIGenericChannelProp<"uydu">;

export function parseSatelliteResponse(
  item: APIResponseBody & SatelliteChannelProp
): SatelliteData {
  // APIResponse -> APIResponseObject
  // i.e. parse extra params
  let parsedExtraParams: SatelliteAPIExtraParams | undefined = undefined;
  if (item.extra_parameters) {
    parsedExtraParams = parseExtraParams<SatelliteAPIExtraParams>(
      item.extra_parameters
    );
  }

  // Transform into client data
  return {
    channel: "uydu",
    geometry: createGeometry(item),
    properties: {
      damage: parsedExtraParams?.damage ?? null,
      verified: item.is_location_verified ?? false,
      icon: "images/icon-13.png",
      name: null,
      description: null,
    },
    reference: item.entry_id ?? null,
  };
}
