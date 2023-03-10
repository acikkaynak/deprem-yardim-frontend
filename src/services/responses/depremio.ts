import { createGeometry } from "@/utils/geometry";
import { Geometry, APIResponseBody, APIGenericChannelProp } from "@/types";
import { parseExtraParams } from "@/services/parseExtraParams";

export type DepremIOAPIExtraParams = {
  name: string;
  styleUrl: string;
  icon: string;
  description?: string;
};

export type DepremIODataProperties = {
  name: string | null;
  description: string | null;
  type: string | null;
  icon: string | null;
};

export type DepremIOData = {
  channel: "depremio";
  geometry: Geometry;
  properties: DepremIODataProperties;
  reference?: number | null;
  closeByRecords?: number[];
  isVisited?: boolean;
};

type DepremIOChannelProp = APIGenericChannelProp<"depremio">;

export function parseDepremIOResponse(
  item: APIResponseBody & DepremIOChannelProp
): DepremIOData {
  // APIResponse -> APIResponseObject
  // i.e. parse extra params
  let parsedExtraParams: DepremIOAPIExtraParams | undefined = undefined;
  if (item.extra_parameters) {
    parsedExtraParams = parseExtraParams<DepremIOAPIExtraParams>(
      item.extra_parameters
    );
  }
  // Transform into client data
  return {
    channel: "depremio",
    geometry: createGeometry(item),
    properties: {
      name: parsedExtraParams?.name ?? null,
      description: parsedExtraParams?.description ?? null,
      type: parsedExtraParams?.styleUrl ?? null,
      icon: "images/icon-deprem.io.png",
    },
    reference: item.entry_id ?? null,
  };
}
