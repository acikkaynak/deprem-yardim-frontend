import { useMTMLView } from "@/components/MTMLView/MTMLView";
import { useDevice, useMapActions } from "@/stores/mapStore";
import {
  DEFAULT_MIN_ZOOM_DESKTOP,
  DEFAULT_MIN_ZOOM_MOBILE,
} from "@/components/Map/utils";
import { CooldownButtonComponent } from "@/components/Button/Cooldown";
import { Map } from "@/components/Map/Map";
import { MapControls } from "./Controls/index";
import { TileLayer } from "react-leaflet";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useMapEvents } from "@/hooks/useMapEvents";
import { MapClusterStyle } from "@/components/Map/Cluster/ClusterStyle";
import { latLng, latLngBounds } from "leaflet";
import {
  useDisasterVictimsData,
  useHelpRequestsData,
  useServicesData,
} from "@/features/location-categories";
import { LayerControl } from "./LayerControl";
import { useMapGeographyStore } from "@/stores/mapGeographyStore";
import { ChannelData } from "@/services/parseChannelData";

const MapEvents = () => {
  useMapEvents();
  return null;
};

export const MapContent = () => {
  const { mapType } = useMTMLView();
  const { coordinates, zoom } = useMapGeographyStore();
  const { setEventType } = useMapActions();
  const device = useDevice();
  const router = useRouter();

  const { data: servicesData = [] } = useServicesData();
  const { data: disasterVictimsData = [] } = useDisasterVictimsData();
  const { data: helpRequestsData = [] } = useHelpRequestsData();

  const onMarkerClick = (_e: any, markerData: ChannelData) => {
    const query = { ...router.query, id: markerData.reference };
    router.push({ query, hash: location.hash }, { query, hash: location.hash });
  };

  const mapBoundaries = {
    southWest: latLng(34.025514, 25.584519),
    northEast: latLng(42.211024, 44.823563),
  };

  const bounds = latLngBounds(mapBoundaries.southWest, mapBoundaries.northEast);

  const dpr = window.devicePixelRatio;
  const baseMapUrl = `https://mt0.google.com/vt/lyrs=${mapType}&scale=${dpr}&hl=en&x={x}&y={y}&z={z}&apistyle=s.e%3Al.i%7Cp.v%3Aoff%2Cs.t%3A3%7Cs.e%3Ag%7C`;

  return (
    <>
      <MapClusterStyle />
      <Map
        zoomControl={false}
        attributionControl={false}
        center={coordinates}
        zoom={zoom}
        minZoom={
          device === "desktop"
            ? DEFAULT_MIN_ZOOM_DESKTOP
            : DEFAULT_MIN_ZOOM_MOBILE
        }
        zoomSnap={1}
        zoomDelta={1}
        whenReady={(map: any) => {
          setTimeout(() => {
            setEventType("ready");
            map.target.invalidateSize();
          }, 100);
        }}
        preferCanvas
        maxBoundsViscosity={1}
        maxBounds={bounds}
        maxZoom={18}
      >
        <MapEvents />
        <MapControls />
        <TileLayer url={baseMapUrl} />

        <LayerControl
          locations={disasterVictimsData
            .concat(servicesData)
            .concat(helpRequestsData)}
          onMarkerClick={onMarkerClick}
        />
      </Map>
      <Box sx={styles.fixedMidBottom}>
        <CooldownButtonComponent />
      </Box>
    </>
  );
};

const styles = {
  fixedMidBottom: () => ({
    position: "fixed",
    bottom: "0px",
    left: "0px",
    width: "100%",
    height: "110px",
    zIndex: 1030,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
  }),
};
