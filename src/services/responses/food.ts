import { createGeometry } from "@/utils/geometry";
import { Geometry, APIResponseBody, APIGenericChannelProp } from "@/types";
import { parseExtraParams } from "@/services/parseExtraParams";

export type FoodAPIExtraParams = {
  name: string;
  styleUrl: string;
  icon: string;
  description?: string;
};

export type FoodDataProperties = {
  name: string | null;
  description: string | null;
  type: string | null;
  icon: string | null;
  reason: string | null;
};

export type FoodData = {
  channel: "yemek";
  properties: FoodDataProperties;
  geometry: Geometry;
  reference?: number | null;
  closeByRecords?: number[];
  isVisited?: boolean;
};

type FoodChannelProp =
  | APIGenericChannelProp<"sicak_yemek">
  | APIGenericChannelProp<"malatya_yemek">
  | APIGenericChannelProp<"adana_yemek">
  | APIGenericChannelProp<"sahra_mutfak">;

export function parseFoodResponse(
  item: APIResponseBody & FoodChannelProp
): FoodData {
  // APIResponse -> APIResponseObject
  // i.e. parse extra params
  let parsedExtraParams: FoodAPIExtraParams | undefined = undefined;
  if (item.extra_parameters) {
    parsedExtraParams = parseExtraParams<FoodAPIExtraParams>(
      item.extra_parameters
    );
  }

  // Transform into client data
  return {
    channel: "yemek",
    geometry: createGeometry(item),
    properties: {
      name: parsedExtraParams?.name ?? null,
      description: parsedExtraParams?.description ?? null,
      type: parsedExtraParams?.styleUrl ?? null,
      icon: "images/icon-21.png",
      reason: item.reason ?? null,
    },
    reference: item.entry_id ?? null,
  };
}
