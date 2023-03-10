import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect } from "react";
import { isValidReasons } from "@/utils/isValidReasons";
import { useSingletonsStore } from "@/stores/singletonsStore";
import useSWR from "swr";
import { useDebounce } from "use-debounce";
import { useLoading } from "@/stores/loadingStore";
import { ChannelData } from "@/services/parseChannelData";

const REQUEST_DEBOUNCE_TIME = 500; //ms

export const useFetchLocations = (
  updaterFunction: Dispatch<SetStateAction<ChannelData[]>>
) => {
  const router = useRouter();
  const queryReasons = router.query.reasons as string | undefined;
  const { apiClient } = useSingletonsStore();
  const { showLoading } = useLoading();

  const debouncedParams = useDebounce([queryReasons], REQUEST_DEBOUNCE_TIME);

  const { isLoading } = useSWR(
    // sends request when some item has changed at the below
    ["areas", ...debouncedParams],
    () => {
      // FIXME: we should send request below condition is true. consider alternative way to inercept it. like enabled: bool in react-query.
      if (isValidReasons(queryReasons)) {
        return apiClient.fetchAreas({
          reasons: queryReasons as string,
        });
      }
    },
    {
      revalidateOnFocus: false,
      onSuccess: (data: ChannelData[] | undefined) => {
        updaterFunction(data ?? []);
      },
    }
  );

  useEffect(() => {
    showLoading(isLoading);
  }, [isLoading, showLoading]);
};
