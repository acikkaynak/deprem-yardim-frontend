import { createGeometry } from "@/utils/geometry";
import { Geometry, APIResponseBody, APIGenericChannelProp } from "@/types";
import { parseExtraParams } from "@/services/parseExtraParams";

export type PharmacyAPIExtraParams = {
  name: string;
  description?: string;
  styleUrl: string;
  icon: string;
};

export type PharmacyDataProperties = {
  name: string | null;
  reason: string | null;
  verified: boolean | null;
  icon: string | null;
  description: string | null;
};

export type PharmacyData = {
  channel: "eczane";
  properties: PharmacyDataProperties;
  geometry: Geometry;
  reference?: number | null;
  closeByRecords?: number[];
  isVisited?: boolean;
};

type PharmacyChannelProp =
  | APIGenericChannelProp<"eczane_excel">
  | APIGenericChannelProp<"turk_eczane">;

export function parsePharmacyResponse(
  item: APIResponseBody & PharmacyChannelProp
): PharmacyData {
  // APIResponse -> APIResponseObject
  // i.e. parse extra params
  let parsedExtraParams: PharmacyAPIExtraParams | undefined = undefined;
  if (item.extra_parameters) {
    parsedExtraParams = parseExtraParams<PharmacyAPIExtraParams>(
      item.extra_parameters
    );
  }

  // Transform into client data
  return {
    channel: "eczane",
    geometry: createGeometry(item),
    properties: {
      name: parsedExtraParams?.name ?? null,
      reason: item.reason ?? null,
      icon: "images/icon-15.png",
      verified: item.is_location_verified ?? false,
      description: null,
    },
    reference: item.entry_id ?? null,
  };
}
