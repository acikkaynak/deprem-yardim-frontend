import { createGeometry } from "@/utils/geometry";
import { Geometry, APIResponseBody, APIGenericChannelProp } from "@/types";
import { parseExtraParams } from "@/services/parseExtraParams";

export type TeyitEnkazAPIExtraParams = {
  name: string;
  styleUrl: string;
  icon: string;
  description?: string;
};

export type TeyitEnkazDataProperties = {
  name: string | null;
  description: string | null;
  type: string | null;
  icon: string | null;
};

export type TeyitEnkazData = {
  channel: "teyit_enkaz";
  properties: TeyitEnkazDataProperties;
  geometry: Geometry;
  reference?: number | null;
  closeByRecords?: number[];
  isVisited?: boolean;
};

type TeyitEnkazChannelProp = APIGenericChannelProp<"teyit_enkaz">;

export function parseTeyitEnkazResponse(
  item: APIResponseBody & TeyitEnkazChannelProp
): TeyitEnkazData {
  // APIResponse -> APIResponseObject
  // i.e. parse extra params
  let parsedExtraParams: TeyitEnkazAPIExtraParams | undefined = undefined;
  if (item.extra_parameters) {
    parsedExtraParams = parseExtraParams<TeyitEnkazAPIExtraParams>(
      item.extra_parameters
    );
  }

  // Transform into client data
  return {
    channel: "teyit_enkaz",
    geometry: createGeometry(item),
    properties: {
      name: parsedExtraParams?.name ?? null,
      description: parsedExtraParams?.description ?? null,
      type: parsedExtraParams?.styleUrl ?? null,
      icon: "images/icon-enkaz.png",
    },
    reference: item.entry_id ?? null,
  };
}
