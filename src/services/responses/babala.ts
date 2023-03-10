import { createGeometry } from "@/utils/geometry";
import { Geometry, APIResponseBody, APIGenericChannelProp } from "@/types";
import { parseExtraParams } from "@/services/parseExtraParams";

export type BabalaAPIExtraParams = {
  additional_notes: string;
  "isim-soyisim": string;
  manual_confirmation: string;
  name: string;
  name_surname: string;
  numara: string;
  status: string;
  tel: number;
  telefon: string;
};

export type BabalaDataProperties = {
  full_text: string;
  reason: string | null;
  timestamp: string | null;
  formatted_address: string;
  name: string | null;
  description: string | null;
  icon: string | null;
};

export type BabalaData = {
  channel: "babala";
  properties: BabalaDataProperties;
  geometry: Geometry;
  reference?: number | null;
  closeByRecords?: number[];
  isVisited?: boolean;
};
type BabalaChannelProp =
  | APIGenericChannelProp<"babala">
  | APIGenericChannelProp<"Babala">;

export function parseBabalaResponse(
  item: APIResponseBody & BabalaChannelProp
): BabalaData {
  // APIResponse -> APIResponseObject
  // i.e. parse extra params
  let parsedExtraParams: BabalaAPIExtraParams | undefined = undefined;
  if (item.extra_parameters) {
    parsedExtraParams = parseExtraParams<BabalaAPIExtraParams>(
      item.extra_parameters
    );
  }
  // Transform into client data
  return {
    channel: "babala",
    properties: {
      reason: item.reason ?? null,
      full_text: item.full_text ?? "",
      timestamp: item.timestamp ?? null,
      formatted_address: item.formatted_address,
      name: parsedExtraParams?.name ?? null,
      description: null,
      icon: "images/icon-babala.png",
    },
    geometry: createGeometry(item),
    reference: item.entry_id ?? null,
  };
}
