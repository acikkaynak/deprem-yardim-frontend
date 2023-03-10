/* eslint-disable no-unused-vars */

import { ChannelData } from "@/services/parseChannelData";
import { DeviceType, EVENT_TYPES } from "@/types";

import { create } from "zustand";

export type ClusterPopupData = {
  count: number;
  baseMarker: ChannelData;
  markers: any[];
};
export enum MapType {
  Terrain = "p",
  Satellite = "y",
  Default = "m",
}

export enum MapLayer {
  Heatmap = "heatmap",
  Markers = "markers",
  Earthquakes = "earthquakes",
  Ahbap = "ahbap",
  Hospital = "hospital",
  Food = "food",
  Teleteyit = "teleteyit",
  Satellite = "satellite",
  Pharmacy = "pharmacy",
  SafePlaces = "safeplaces",
}

export type DrawerData = ChannelData | null;

interface MapState {
  eventType?: EVENT_TYPES;
  popUpData: ClusterPopupData | null;
  drawerData: DrawerData;
  isDrawerOpen: boolean;
  device: DeviceType;
  mapType: MapType;
  mapLayers: MapLayer[];
  actions: {
    toggleDrawer: () => void;
    toggleMapLayer: (mapLayer: MapLayer) => void;

    // after click a point, pass to drawer content
    setDrawerData: (data: DrawerData) => void;
    setPopUpData: (data: ClusterPopupData | null) => void;
    setDevice: (device: DeviceType) => void;
    setMapType: (mapType: MapType) => void;
    setEventType: (eventType: EVENT_TYPES) => void;
  };
}

export const useMapStore = create<MapState>()((set) => ({
  drawerData: null,
  popUpData: null,
  isDrawerOpen: false,
  device: "desktop",
  markerData: [],
  mapType: MapType.Default,
  mapLayers: [
    MapLayer.Ahbap,
    MapLayer.Pharmacy,
    MapLayer.SafePlaces,
    MapLayer.Hospital,
    MapLayer.Food,
    MapLayer.Teleteyit,
  ],
  actions: {
    toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
    toggleMapLayer: (mapLayer: MapLayer) =>
      set(({ mapLayers }) => ({
        mapLayers: mapLayers.includes(mapLayer)
          ? mapLayers.filter((layer) => layer !== mapLayer)
          : mapLayers.concat(mapLayer),
      })),
    setDrawerData: (data: DrawerData) => set(() => ({ drawerData: data })),
    setPopUpData: (data: ClusterPopupData | null) =>
      set(() => ({ popUpData: data })),
    setDevice: (device: DeviceType) => set(() => ({ device })),
    setMapType: (mapType) => set(() => ({ mapType })),
    setEventType: (eventType) => set(() => ({ eventType })),
  },
}));

export const useIsDrawerOpen = () => useMapStore((state) => state.isDrawerOpen);
export const useDrawerData = () => useMapStore((state) => state.drawerData);
export const useMapActions = () => useMapStore((state) => state.actions);
export const useMapLayers = () => useMapStore((state) => state.mapLayers);
export const useMapType = () =>
  useMapStore((state) => state.mapType ?? MapType.Default);
export const usePopUpData = () => useMapStore((state) => state.popUpData);
export const useDevice = () => useMapStore((state) => state.device);
export const useEventType = () => useMapStore((state) => state.eventType);
