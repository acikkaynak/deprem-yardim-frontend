import { create } from "zustand";
import { PartialDataError } from "@/errors";
import { ChannelData } from "@/services/parseChannelData";

interface MapState {
  shouldFetchNextOption: boolean;
  sendRequest: boolean;
  markers: ChannelData[];
  error?: PartialDataError;
  actions: {
    setError: (_error: PartialDataError) => void;
    setMarkerData: (_markers: any) => void;
    setSendRequest: () => void;
    setShouldFetchNextOption: (_shouldFetchNextOption: boolean) => void;
  };
}

export const useAreasStore = create<MapState>()((set) => ({
  shouldFetchNextOption: false,
  error: undefined,
  sendRequest: false,
  markers: [],
  actions: {
    setMarkerData: (markers) => set(() => ({ markers })),
    setSendRequest: () => set(() => ({ sendRequest: true })),
    setShouldFetchNextOption: (shouldFetchNextOption) =>
      set(() => ({ shouldFetchNextOption })),
    setError: (error) => set(() => ({ error })),
  },
}));

export const useAreasMarkerData = () => useAreasStore((state) => state.markers);
export const useAreasActions = () => useAreasStore((state) => state.actions);
export const useSendRequest = () => useAreasStore((state) => state.sendRequest);
export const useAreasStoreError = () => useAreasStore((state) => state.error);
export const useShouldFetchNextOption = () =>
  useAreasStore((state) => state.shouldFetchNextOption);
