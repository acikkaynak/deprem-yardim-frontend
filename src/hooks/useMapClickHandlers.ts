import { MarkerVisited } from "@/types";
import { useMapActions } from "@/stores/mapStore";
import { useCallback, MouseEvent, KeyboardEvent } from "react";
import { LeafletMouseEvent } from "leaflet";

import * as localForage from "localforage";
import { localForageKeys } from "@/components/Map/utils";
import { useAreasActions } from "@/stores/areasStore";
import { ChannelData } from "@/services/parseChannelData";

export function useMapClickHandlers() {
  const { toggleDrawer, setDrawerData, setPopUpData } = useMapActions();
  const { setMarkerData } = useAreasActions();

  const handleMarkerClick = useCallback(
    async (
      event: KeyboardEvent | MouseEvent | LeafletMouseEvent,
      selectedMarkerData?: ChannelData,
      allMarkers?: ChannelData[]
    ) => {
      if (event.type === "keydown" && (event as KeyboardEvent).key !== "Escape")
        return;

      const markerVisitedMap: MarkerVisited =
        (await localForage.getItem(localForageKeys.markersVisited)) || {};

      const closeByRecords: number[] = [];
      if (allMarkers && selectedMarkerData?.reference) {
        markerVisitedMap[selectedMarkerData?.reference] = true;

        localForage.setItem(localForageKeys.markersVisited, markerVisitedMap);

        const changedMarkerIndex = allMarkers.findIndex(
          (marker) => marker.reference === selectedMarkerData?.reference
        );

        if (changedMarkerIndex !== -1) {
          const geometry = selectedMarkerData?.geometry;
          const reference = selectedMarkerData?.reference;
          if (geometry) {
            allMarkers.forEach(({ geometry: { location }, reference: ref }) => {
              if (
                location.lat !== geometry.location.lat ||
                location.lng !== geometry.location.lng ||
                !ref
              )
                return;
              closeByRecords.push(ref);
            });
          }
          const finalArr = allMarkers;
          finalArr[changedMarkerIndex] = {
            reference,
            geometry,
            isVisited: true,
          } as ChannelData;

          setMarkerData(finalArr);
        }
      }

      toggleDrawer();

      if (selectedMarkerData) {
        setDrawerData({ ...selectedMarkerData, closeByRecords });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleClusterClick = useCallback(
    (markers: ChannelData[], count: number = 0) => {
      setPopUpData({
        count,
        baseMarker: markers[0],
        markers: [],
      });
    },
    [setPopUpData]
  );

  return { handleMarkerClick, handleClusterClick };
}
