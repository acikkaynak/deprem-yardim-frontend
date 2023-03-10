import { createGeometry } from "@/utils/geometry";
import { Geometry, APIResponseBody, APIGenericChannelProp } from "@/types";
import { parseExtraParams } from "@/services/parseExtraParams";

export type SafePlaceAPIExtraParams = {
  name: string;
  description?: string;
  styleUrl: string;
  icon: string;
};

export type SafePlaceDataProperties = {
  reason: string | null;
  verified: boolean;
  name: string | null;
  icon: string;
  description: string | null;
};

export type SafePlaceData = {
  channel: "guvenli";
  properties: SafePlaceDataProperties;
  geometry: Geometry;
  reference?: number | null;
  closeByRecords?: number[];
  isVisited?: boolean;
};

type SafePlaceChannelProp = APIGenericChannelProp<"guvenli_yerler_oteller">;

export function parseSafePlaceResponse(
  item: APIResponseBody & SafePlaceChannelProp
): SafePlaceData {
  // APIResponse -> APIResponseObject
  // i.e. parse extra params
  let parsedExtraParams: SafePlaceAPIExtraParams | undefined = undefined;
  if (item.extra_parameters) {
    parsedExtraParams = parseExtraParams<SafePlaceAPIExtraParams>(
      item.extra_parameters
    );
  }

  // Transform into client data
  return {
    channel: "guvenli",
    geometry: createGeometry(item),
    properties: {
      description: parsedExtraParams?.description ?? null,
      icon: "images/icon-16.png",
      reason: item.reason ?? null,
      name: parsedExtraParams?.name ?? null,
      verified: item.is_location_verified ?? false,
    },
    reference: item.entry_id ?? null,
  };
}
