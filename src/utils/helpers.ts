const isNaN = (value: unknown) =>
  typeof value === "string" && value.toLowerCase() === "nan";

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

function addParameterToUrl(param: string, value: string) {
  let url = new URL(window.location.href);
  url.searchParams.set(param, value);
  window.history.pushState({}, "", url);
}

function getParameterValueFromUrl(param: string) {
  let url = new URL(window.location.href);
  return url.searchParams.get(param);
}

export { capitalize, isNaN, addParameterToUrl, getParameterValueFromUrl };
