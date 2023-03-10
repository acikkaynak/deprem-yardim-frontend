import { createGeometry } from "@/utils/geometry";
import { Geometry, APIResponseBody, APIGenericChannelProp } from "@/types";
import { parseExtraParams } from "@/services/parseExtraParams";

export type TeyitYardimAPIExtraParams = {
  name: string;
  styleUrl: string;
  icon: string;
  description?: string;
};

export type TeyitYardimDataProperties = {
  name: string | null;
  description: string | null;
  type: string | null;
  icon: string | null;
};

export type TeyitYardimData = {
  channel: "teyit_yardim";
  properties: TeyitYardimDataProperties;
  geometry: Geometry;
  reference?: number | null;
  closeByRecords?: number[];
  isVisited?: boolean;
};

type TeyitYardimChannelProp = APIGenericChannelProp<"teyit_yardim">;

export function parseTeyitYardimResponse(
  item: APIResponseBody & TeyitYardimChannelProp
): TeyitYardimData {
  // APIResponse -> APIResponseObject
  // i.e. parse extra params
  let parsedExtraParams: TeyitYardimAPIExtraParams | undefined = undefined;
  if (item.extra_parameters) {
    parsedExtraParams = parseExtraParams<TeyitYardimAPIExtraParams>(
      item.extra_parameters
    );
  }

  // Transform into client data
  return {
    channel: "teyit_yardim",
    geometry: createGeometry(item),
    properties: {
      name: parsedExtraParams?.name ?? null,
      description: parsedExtraParams?.description ?? null,
      type: parsedExtraParams?.styleUrl ?? null,
      icon: "images/icon-yardim.png",
    },
    reference: item.entry_id ?? null,
  };
}
