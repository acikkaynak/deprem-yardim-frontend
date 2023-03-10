import dynamic from "next/dynamic";
import { Box, SxProps, Theme } from "@mui/material";
import { HelpViewComponent } from "@/components/UserGuide/UserGuide";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ApiClient } from "@/services/ApiClient";
import { APIResponse } from "@/types";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { HeadWithMeta } from "@/components/HeadWithMeta/HeadWithMeta";
import { BASE_URL } from "@/utils/constants";
import { ChannelData } from "@/services/parseChannelData";

const MapContent = dynamic(
  () => import("@/components/Map/Content").then((mod) => mod.MapContent),
  { ssr: false }
);

const Drawer = dynamic(
  () => import("@/components/Drawer/NewDrawer").then((mod) => mod.Drawer),
  { ssr: false }
);
// Development overlay container
const UIElementsOverlay = () => {
  return (
    <Box sx={styles.overlay}>
      <HelpViewComponent />
    </Box>
  );
};

interface INHome {
  channel: ChannelData;
  apiResponse: APIResponse;
}

const NHome = (props: INHome) => {
  const { copyToClipBoard } = useCopyToClipboard();

  return (
    <>
      <HeadWithMeta singleItemDetail={props.apiResponse} />
      <main id="new-layout">
        <UIElementsOverlay />
        <MapContent />
        <Drawer
          data={props.channel}
          onCopyBillboard={(_clipped) => copyToClipBoard(_clipped as string)}
        />
      </main>
    </>
  );
};

export default NHome;

export async function getServerSideProps(context: any) {
  const client = new ApiClient({ url: BASE_URL });
  const searchParams = new URLSearchParams(context.query);
  let redirect = false;

  let channel: ChannelData | null = null;
  let apiResponse: APIResponse | null = null;
  if (context.query.id) {
    const response = await client.fetchLocationByID(context.query.id);
    channel = response.channel;
    apiResponse = response._raw;

    if (!response.channel) {
      searchParams.delete("id");
      redirect = true;
    }
  }

  // Pass data to the page via props
  const UA = context.req.headers["user-agent"];
  const isMobile = Boolean(
    UA.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
    )
  );

  if (redirect) {
    return {
      redirect: {
        permanent: false,
        destination: "/?" + searchParams.toString(),
      },
    };
  }
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ["common", "home"])),
      deviceType: isMobile ? "mobile" : "desktop",
      channel,
      apiResponse,
    },
  };
}

interface IStyles {
  [key: string]: SxProps<Theme>;
}

const styles: IStyles = {
  overlay: (theme: Theme) => ({
    display: "flex",
    position: "fixed",
    flexDirection: "column",
    top: "10px",
    left: "60px",
    zIndex: 1100,
    pointerEvents: "none",
    [theme.breakpoints.down("sm")]: {
      top: "0px",
      left: "0px",
    },
  }),
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
