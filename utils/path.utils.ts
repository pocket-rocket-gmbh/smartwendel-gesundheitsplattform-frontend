const get = (object: Record<string, unknown>, path: Array<string>, index = 0): string => {
  const key = path[index];

  if (key === undefined) {
    return "";
  }

  const result = object[key];
  if (result === undefined) {
    return "";
  }
  if (typeof result === "string") {
    return result;
  }
  return get(Object(result), path, index + 1);
};

export const pathInto = (myJson: any, key: string): string => {
  const translated = get(myJson, key.split("."));

  if (translated === "") return key;

  return translated;
};
