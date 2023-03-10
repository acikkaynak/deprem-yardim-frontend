import dJSON from "dirty-json";

export const parseExtraParams = <TExtraParams>(extraParamsStr: string) => {
  try {
    return dJSON.parse<string, TExtraParams>(
      extraParamsStr?.replaceAll("nan", "").replaceAll(/\\"/g, '"')
    );
  } catch (error) {
    console.error(error);
  }
};
