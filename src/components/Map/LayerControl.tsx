import { HeatmapLayerFactory } from "@vgrid/react-leaflet-heatmap-layer";
import { GenericClusterGroup } from "@/components/Map/Cluster/GenericClusterGroup";
import { MapLayer } from "../MTMLView/types";
import { memo, useMemo } from "react";
import { useMTMLView } from "../MTMLView/MTMLView";
import { DEFAULT_IMPORTANCY } from "./utils";
import { ChannelData } from "@/services/parseChannelData";

const HeatmapLayer = memo(HeatmapLayerFactory<Point>());

type Point = [number, number, number];

const longitudeExtractor = (p: Point) => p[1];
const latitudeExtractor = (p: Point) => p[0];
const intensityExtractor = (p: Point) => p[2];

type Props = {
  locations: ChannelData[];
  onMarkerClick: (_event: any, _markerData: ChannelData) => void;
};

const useHeatmapPoints = (locations: ChannelData[]) => {
  return useMemo(
    () =>
      locations.map(
        (item) =>
          [
            item.geometry.location.lng,
            item.geometry.location.lat,
            DEFAULT_IMPORTANCY,
          ] as Point
      ),
    [locations]
  );
};

export const LayerControl = ({ locations, onMarkerClick }: Props) => {
  const { mapLayers } = useMTMLView();
  const points = useHeatmapPoints(locations);

  return (
    <>
      {mapLayers.map((layer, idx) => {
        if (layer === MapLayer.Heatmap) {
          return (
            <HeatmapLayer
              key={idx}
              fitBoundsOnUpdate
              radius={15}
              points={points}
              longitudeExtractor={longitudeExtractor}
              latitudeExtractor={latitudeExtractor}
              intensityExtractor={intensityExtractor}
              useLocalExtrema={false}
            />
          );
        }
        return (
          <GenericClusterGroup
            key={idx}
            data={locations}
            onMarkerClick={onMarkerClick}
          />
        );
      })}
    </>
  );
};
