import { createGeometry } from "@/utils/geometry";
import { Geometry, APIResponseBody, APIGenericChannelProp } from "@/types";
import { parseExtraParams } from "@/services/parseExtraParams";

export type AhbapAPIExtraParams = {
  name: string;
  styleUrl: string;
  icon: string;
  description?: string;
};

export type AhbapDataProperties = {
  name: string | null;
  description: string | null;
  type: string | null;
  icon: string | null;
};

export type AhbapData = {
  channel: "ahbap";
  properties: AhbapDataProperties;
  geometry: Geometry;
  reference?: number | null;
  closeByRecords?: number[];
  isVisited?: boolean;
};
type AhbapChannelProp = APIGenericChannelProp<"ahbap_location">;

export function parseAhbapResponse(
  item: APIResponseBody & AhbapChannelProp
): AhbapData {
  // APIResponse -> APIResponseObject
  // i.e. parse extra params
  let parsedExtraParams: AhbapAPIExtraParams | undefined = undefined;
  if (item.extra_parameters) {
    parsedExtraParams = parseExtraParams<AhbapAPIExtraParams>(
      item.extra_parameters
    );
  }
  // Transform into client data
  return {
    channel: "ahbap",
    geometry: createGeometry(item),
    properties: {
      name: parsedExtraParams?.name ?? null,
      description: parsedExtraParams?.description ?? null,
      type: parsedExtraParams?.styleUrl ?? null,
      icon: "images/icon-ahbap.png",
    },
    reference: item.entry_id ?? null,
  };
}
