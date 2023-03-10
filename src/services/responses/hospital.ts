import { createGeometry } from "@/utils/geometry";
import { Geometry, APIResponseBody, APIGenericChannelProp } from "@/types";
import { parseExtraParams } from "@/services/parseExtraParams";

export type HospitalAPIExtraParams = {
  name: string;
  il: string;
  ilce: string;
  kurum: string;
};

export type HospitalDataProperties = {
  name: string | null;
  description: string | null;
  icon: string | null;
  city: string | null;
};

export type HospitalData = {
  channel: "hastane";
  properties: HospitalDataProperties;
  geometry: Geometry;
  reference?: number | null;
  closeByRecords?: number[];
  isVisited?: boolean;
};

type HospitalChannelProp = APIGenericChannelProp<"hastahane_locations">;

export function parseHospitalResponse(
  item: APIResponseBody & HospitalChannelProp
): HospitalData {
  // APIResponse -> APIResponseObject
  // i.e. parse extra params
  let parsedExtraParams: HospitalAPIExtraParams | undefined = undefined;
  if (item.extra_parameters) {
    parsedExtraParams = parseExtraParams<HospitalAPIExtraParams>(
      item.extra_parameters
    );
  }

  // Transform into client data
  return {
    channel: "hastane",
    geometry: createGeometry(item),
    properties: {
      name: parsedExtraParams?.name ?? null,
      icon: "images/icon-10.png",
      city: parsedExtraParams?.il ?? null,
      description: null,
    },
    reference: item.entry_id ?? null,
  };
}
