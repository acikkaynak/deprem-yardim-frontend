import { APIChannel, APIResponse, apiChannels } from "@/types";
import { dataFetcher } from "./dataFetcher";
import { ChannelData, parseChannelData } from "./parseChannelData";

export type Bounds = {
  ne_lat: string;
  ne_lng: string;
  sw_lat: string;
  sw_lng: string;
};

type FetchAreasOptions = {
  reasons: string;
  bound?: Bounds;
  channels?: APIChannel[];
  timestamp?: number;
};

type ApiClientProps = {
  url: string;
};

export class ApiClient {
  url: string;

  constructor(props: ApiClientProps) {
    this.url = props.url;
  }

  async fetchAreas(options: FetchAreasOptions) {
    const url = new URL(this.url + "/feeds/areas");
    const searchParams = new URLSearchParams({
      reason: options.reasons,
      ...options.bound,
      extraParams: "true",
    });

    if (options.channels && options.channels.length > 0) {
      searchParams.set("channel", options.channels.join(","));
    }

    if (options.timestamp && options.timestamp > 0) {
      searchParams.set("time_stamp", options.timestamp.toString());
    }

    url.search = decodeURIComponent(searchParams.toString());

    const response = await dataFetcher<{ results: APIResponse[] }>(url);

    const data = (response.results ?? [])
      .map((item) => {
        if (apiChannels.includes(item.channel)) {
          return parseChannelData(item);
        }
      })
      .filter(Boolean) as ChannelData[];

    return data;
  }

  async fetchReasons() {
    return reasons;
    // const response = (await dataFetcher(this.url + "/reasons")) as {
    //   reasons: string[];
    // };
    //
    // return response.reasons;
  }

  async fetchLocationByID(id: number) {
    const response = await dataFetcher<APIResponse>(`${this.url}/feeds/${id}`);

    let channel: ChannelData | undefined = undefined;
    if (apiChannels.includes(response.channel)) {
      channel = parseChannelData(response);
    }

    return { channel: channel ?? null, _raw: response ?? null };
  }
}

const reasons = [
  "barinma",
  "elektronik",
  "enkaz",
  "erzak",
  "genel",
  "giysi",
  "guvenli-noktalar",
  "hayvanlar-icin-tedavi",
  "konaklama",
  "kurtarma",
  "lojistik",
  "saglik",
  "su",
  "yardim",
  "yemek",
] as const;

export type Reason = (typeof reasons)[number];
