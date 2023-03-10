import { Geometry } from "@/types";

type Arg = {
  loc?: [number, number];
  lat?: number;
  lng?: number;
};

export const createGeometry = (res: Arg): Geometry => ({
  location: {
    lat: res.loc?.[1] ?? res.lat ?? 0,
    lng: res.loc?.[0] ?? res.lng ?? 0,
  },
});
