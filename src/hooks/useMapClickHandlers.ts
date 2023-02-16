import { MarkerData, MarkerVisited } from "@/types";
import { useMapActions } from "@/stores/mapStore";
import { useCallback, MouseEvent, KeyboardEvent } from "react";
import { LeafletMouseEvent } from "leaflet";
import { AhbapData, SahraKitchenData, TeleteyitData } from "@/types";

import * as localForage from "localforage";
import { localForageKeys } from "@/components/UI/Map/utils";
import { useAreasActions } from "@/stores/areasStore";

export function useMapClickHandlers() {
  const { toggleDrawer, setDrawerData, setPopUpData } = useMapActions();
  const { setMarkerData } = useAreasActions();
  const handleMarkerClick = useCallback(
    async (
      event: KeyboardEvent | MouseEvent | LeafletMouseEvent,
      selectedMarkerData?:
        | MarkerData
        | AhbapData
        | TeleteyitData
        | SahraKitchenData,
      allMarkers?: MarkerData[]
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
                location.lng !== geometry.location.lng
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
          } as MarkerData;

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
    (location: any, count: number = 0) => {
      setPopUpData({
        count,
        baseMarker: {
          lat: location.coordinates[1],
          lng: location.coordinates[0],
        },
      });
    },
    [setPopUpData]
  );

  return { handleMarkerClick, handleClusterClick };
}
