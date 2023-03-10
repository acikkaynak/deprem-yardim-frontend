import { createGeometry } from "@/utils/geometry";
import { Geometry, APIResponseBody, APIGenericChannelProp } from "@/types";
import { parseExtraParams } from "@/services/parseExtraParams";

export type TwitterAPIExtraParams = {
  tweet_id: string;
  screen_name: string;
  name?: string;
};

export type TwitterDataProperties = {
  tweet_id: string | null;
  screen_name: string | null;
  name: string | null;
  reason: string | null;
  full_text: string;
  timestamp: string | null;
  formatted_address: string;
  description: string | null;
  icon: string | null;
};

export type TwitterData = {
  channel: "twitter";
  properties: TwitterDataProperties;
  geometry: Geometry;
  reference?: number | null;
  closeByRecords?: number[];
  isVisited?: boolean;
};

type TwitterChannelProp = APIGenericChannelProp<"twitter">;

export function parseTwitterResponse(
  item: APIResponseBody & TwitterChannelProp
): TwitterData {
  // APIResponse -> APIResponseObject
  // i.e. parse extra params
  let parsedExtraParams: TwitterAPIExtraParams | undefined = undefined;
  if (item.extra_parameters) {
    parsedExtraParams = parseExtraParams<TwitterAPIExtraParams>(
      item.extra_parameters
    );
  }

  // Transform into client data
  return {
    channel: "twitter",
    properties: {
      icon: "images/icon-twitter.png",
      full_text: item.full_text ?? "",
      reason: item.reason ?? null,
      screen_name: parsedExtraParams?.screen_name ?? null,
      name: parsedExtraParams?.name ?? null,
      tweet_id: parsedExtraParams?.tweet_id ?? null,
      formatted_address: item.formatted_address,
      timestamp: item.timestamp ?? null,
      description: null,
    },
    geometry: createGeometry(item),
    reference: item.entry_id ?? null,
  };
}
