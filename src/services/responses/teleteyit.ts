import { createGeometry } from "@/utils/geometry";
import { Geometry, APIResponseBody, APIGenericChannelProp } from "@/types";
import { parseExtraParams } from "@/services/parseExtraParams";

export type TeleteyitAPIExtraParams = {
  "isim-soyisim": string;
  numara: string;
  aciklama: string;
  il: string;
  ilce: string;
  excel_id: number;
  durum: string;
};

export type TeleteyitDataProperties = {
  name: string | null;
  description: string | null;
  icon: string;
  city: string | null;
  district: string | null;
  status: string | null;
  reason: string | null;
};

export type TeleteyitData = {
  channel: "teleteyit";
  properties: TeleteyitDataProperties;
  geometry: Geometry;
  reference?: number | null;
  closeByRecords?: number[];
  isVisited?: boolean;
};

type TeleteyitChannelProp = APIGenericChannelProp<"teleteyit">;

export function parseTeleteyitResponse(
  item: APIResponseBody & TeleteyitChannelProp
): TeleteyitData {
  // APIResponse -> APIResponseObject
  // i.e. parse extra params
  let parsedExtraParams: TeleteyitAPIExtraParams | undefined = undefined;
  if (item.extra_parameters) {
    parsedExtraParams = parseExtraParams<TeleteyitAPIExtraParams>(
      item.extra_parameters
    );
  }
  const isimSoyisim = parsedExtraParams
    ? parsedExtraParams["isim-soyisim"]
    : null;

  // Transform into client data
  return {
    channel: "teleteyit",
    geometry: createGeometry(item),
    properties: {
      name: isimSoyisim,
      description: parsedExtraParams?.aciklama ?? null,
      icon: "images/icon-14.png",
      reason: item.reason ?? null,
      city: parsedExtraParams?.il ?? null,
      district: parsedExtraParams?.ilce ?? null,
      status: parsedExtraParams?.durum ?? null,
    },
    reference: item.entry_id ?? null,
  };
}
