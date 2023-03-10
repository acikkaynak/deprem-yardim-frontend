import { APIResponse } from "@/types";
import {
  parseAhbapResponse,
  parseBabalaResponse,
  parseDepremIOResponse,
  parseFoodResponse,
  parsePharmacyResponse,
  parseHospitalResponse,
  parseSafePlaceResponse,
  parseSatelliteResponse,
  parseTeleteyitResponse,
  parseTeyitEnkazResponse,
  parseTeyitYardimResponse,
  parseTwitterResponse,
} from "./responses";

export const parseChannelData = ((item: APIResponse) => {
  switch (item.channel) {
    case "eczane_excel":
    case "turk_eczane":
      return parsePharmacyResponse(item);
    case "sahra_mutfak":
    case "sicak_yemek":
    case "malatya_yemek":
    case "adana_yemek":
      return parseFoodResponse(item);
    case "ahbap_location":
      return parseAhbapResponse(item);
    case "babala":
    case "Babala":
      return parseBabalaResponse(item);
    case "depremio":
      return parseDepremIOResponse(item);
    case "hastahane_locations":
      return parseHospitalResponse(item);
    case "guvenli_yerler_oteller":
      return parseSafePlaceResponse(item);
    case "uydu":
      return parseSatelliteResponse(item);
    case "teleteyit":
      return parseTeleteyitResponse(item);
    case "teyit_enkaz":
      return parseTeyitEnkazResponse(item);
    case "teyit_yardim":
      return parseTeyitYardimResponse(item);
    case "twitter":
      return parseTwitterResponse(item);
  }
}) satisfies (_item: APIResponse) => {}; // to make sure all channels are covered

export type ChannelData = ReturnType<typeof parseChannelData>;
export type ClientChannel = ChannelData["channel"];
