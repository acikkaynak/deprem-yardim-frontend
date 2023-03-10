import styles from "./Drawer.module.css";
import { default as MuiDrawer } from "@mui/material/Drawer";
import { DrawerData } from "../../stores/mapStore";
import { BabalaDataProperties } from "@/services/responses/babala";
import { TwitterDataProperties } from "@/services/responses/twitter";
import Button from "@mui/material/Button";
import { CopyAll, OpenInNew } from "@mui/icons-material";
import { useTranslation } from "next-i18next";
import formatcoords from "formatcoords";
import { MapButtons, generateGoogleMapsUrl } from "./components/MapButtons";
import TextField from "@mui/material/TextField";
import { PropsWithChildren } from "react";
import { FeedContent } from "./components/channels/FeedContent";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useRouter } from "next/router";
import { getTimeAgo } from "@/utils/date";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import RoomIcon from "@mui/icons-material/Room";
import omit from "lodash.omit";
import Link from "next/link";
import { ChannelData } from "@/services/parseChannelData";

const DrawerIDLabel = ({ id }: { id: number }) => {
  return <span className={styles.contentIdSection}>ID: {id}</span>;
};

const TwitterButton = ({ data }: { data: ChannelData }) => {
  const { t } = useTranslation("home");

  return (
    <Button
      variant="outlined"
      className={styles.clipboard}
      fullWidth
      size="small"
      onClick={() =>
        window.open(
          // @ts-ignore: tweet_id generic olmadığı için kızıyor, type ile fixlenebilir
          `https://twitter.com/anyuser/status/${data.properties.tweet_id}`
        )
      }
      startIcon={<OpenInNew className={styles.btnIcon} />}
      color="secondary"
    >
      {t("content.source")}
    </Button>
  );
};

const TimeLabel = ({ timeLabel }: { timeLabel: string }) => {
  const { t } = useTranslation("home");

  return (
    <div className={styles.contentInfo}>
      <AccessTimeFilledIcon fontSize="small" />
      <span>
        {t("content.notifyTime")}: {timeLabel}
      </span>
    </div>
  );
};

const Coordinates = ({ coordinates }: { coordinates: string }) => {
  return (
    <div className={styles.contentInfo}>
      <RoomIcon fontSize="small" />
      <span>{coordinates}</span>
    </div>
  );
};

const GoogleMapsStuff = ({
  children,
  data,
  onCopyBillboard,
}: PropsWithChildren<{
  data: ChannelData;
  onCopyBillboard: (_clipped: string) => void;
}>) => {
  const { t } = useTranslation("home");
  return (
    <div>
      <TextField
        fullWidth
        variant="standard"
        size="small"
        value={generateGoogleMapsUrl(
          data.geometry.location.lat,
          data.geometry.location.lng
        )}
        InputProps={{
          readOnly: true,
        }}
      />
      <div className={styles.actionButtons}>
        <Button
          variant="outlined"
          className={styles.clipboard}
          size="small"
          fullWidth
          onClick={() =>
            onCopyBillboard(
              `https://www.google.com/maps/@${data.geometry.location.lat.toString()},${data.geometry.location.lng.toString()},22z`
            )
          }
          startIcon={<CopyAll className={styles.btnIcon} />}
        >
          {t("cluster.mapButtons.copy")}
        </Button>
        {children}
      </div>
    </div>
  );
};

type DrawerProps = {
  data: DrawerData;
  onCopyBillboard: (_clipped: string) => void;
};

export const Drawer = ({ data, onCopyBillboard }: DrawerProps) => {
  const size = useWindowSize();
  const anchor = size.width > 768 ? "left" : "bottom";
  const router = useRouter();

  return (
    <MuiDrawer
      className={styles.drawer}
      open={!!data}
      anchor={anchor}
      hideBackdrop
    >
      <Box
        sx={{
          width: size.width > 768 ? 400 : "full",
          display: "flex",
          height: "100%",
          padding: "1rem 2rem 1rem 1rem",
          flexDirection: "column",
          overflow: "auto",
        }}
        role="presentation"
      >
        {data && (
          <DrawerContent data={data} onCopyBillboard={onCopyBillboard} />
        )}
        {/* <CloseByRecord drawerData={drawerData} /> */}
        <Link
          href={{
            pathname: "/",
            query: omit(router.query, "id"),
            hash: window.location.hash,
          }}
        >
          <CloseIcon className={styles.closeButton} />
        </Link>
      </Box>
    </MuiDrawer>
  );
};

const DrawerContent = ({
  data,
  onCopyBillboard,
}: {
  data: NonNullable<DrawerProps["data"]>;
  onCopyBillboard: DrawerProps["onCopyBillboard"];
}) => {
  const router = useRouter();

  const twitterBabala = data.properties as
    | TwitterDataProperties
    | BabalaDataProperties;

  const timeLabel =
    twitterBabala?.timestamp &&
    getTimeAgo(twitterBabala.timestamp, router.locale);

  const title = twitterBabala?.formatted_address ?? data.properties.name;

  const hasSource =
    data &&
    data?.channel === "twitter" &&
    (data.properties as TwitterDataProperties).tweet_id;

  const formattedCoordinates = formatcoords([
    data.geometry.location?.lng,
    data.geometry.location?.lat,
  ]).format();

  return (
    <div className={styles.content}>
      {data?.reference && <DrawerIDLabel id={data.reference} />}
      {title && <h3 style={{ maxWidth: "45ch" }}>{title}</h3>}
      {timeLabel && <TimeLabel timeLabel={timeLabel} />}
      <Coordinates coordinates={formattedCoordinates} />
      <MapButtons drawerData={data} />
      <GoogleMapsStuff data={data} onCopyBillboard={onCopyBillboard}>
        {hasSource && <TwitterButton data={data} />}
      </GoogleMapsStuff>
      <FeedContent content={data} />
    </div>
  );
};
