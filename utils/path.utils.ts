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

export const pathIntoObject = (obj: any, path: string): any => {
  if (!isValidJSONPath(path)) throw `Path '${path}' is no valid JSON path`;
  const properties = path.split(".");
  let result = obj;

  for (const property of properties) {
    if (result.hasOwnProperty(property)) {
      result = result[property];
    } else {
      return undefined;
    }
  }

  return result;
};

export const isValidJSONPath = (path: string) => {
  return !!path.match(/^[\w$]+(\.[\w$]+)*$/)?.length;
};