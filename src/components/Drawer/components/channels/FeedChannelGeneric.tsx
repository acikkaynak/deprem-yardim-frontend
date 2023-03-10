import Typography from "@mui/material/Typography";
import { Chip, Divider } from "@mui/material";
import { useTranslation } from "next-i18next";
import { Stack } from "@mui/system";
import { ChannelData } from "@/services/parseChannelData";

export const FeedChannelGeneric = ({ channel, properties }: ChannelData) => {
  const { icon, reason } = properties as {
    icon: string | null;
    reason?: string | null;
  };
  const { t } = useTranslation("home");

  interface ChannelNameTranslations {
    [key: string]: string;
  }

  const genericChannelNameTranslations: ChannelNameTranslations = {
    yemek: t("content.channels.food"),
    hastane: t("content.channels.hospital"),
    ahbap: t("content.channels.ahbap"),
    teyit_yardim: t("content.channels.verified_relief"),
    teyit_enkaz: t("content.channels.verified_rescue"),
    uda_yardim: t("content.channels.uda"),
    veteriner: t("content.channels.veterinary"),
    diyaliz_merkezleri: t("content.channels.dialysis"),
    discord: t("content.channels.discord"),
    depremio: t("content.channels.deprem_io"),
    psikolojik_destek: t("content.channels.psychological_support"),
    depremihtiyaccom: t("content.channels.deprem_ihtiyac"),
    gecici_barinma_gida_dagitim: t("content.channels.temporary_house"),
    tahliye_noktalari: t("content.channels.evacuation"),
  };

  return (
    <div style={styles.container}>
      <div style={styles.logo_container}>
        <Typography style={styles.logo}>
          {genericChannelNameTranslations[channel] || channel}
        </Typography>
        {icon && <img style={styles.icon} src={icon} alt={`${channel} icon`} />}
      </div>
      <Divider />
      {properties.description && (
        <Typography
          style={styles.description}
        >{`${properties.description}`}</Typography>
      )}

      <Stack flexDirection="row" display="flex" gap={2} mt={4}>
        {reason &&
          reason
            ?.split(",")
            ?.map((reason: string, index: number) => (
              <Chip key={index} label={reason} color="info" />
            ))}
      </Stack>
    </div>
  );
};

const styles = {
  logo_container: {
    display: "flex",
    flexDirection: "row" as "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  logo: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontWeight: 800,
  },
  icon: {
    width: 28,
    height: 28,
  },
  container: {
    padding: "11px 15px 40px 15px",
    margin: "10px 0",
    borderRadius: "12px",
    backgroundColor: "#fff",
    border: "1px solid #e0e0e0",
  },
  name: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.35,
    marginTop: 20,
  },
  description: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1.35,
    marginTop: 20,
  },
};
