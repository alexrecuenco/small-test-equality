// see https://github.com/microsoft/TypeScript/issues/1897#issuecomment-331765301
export type JSONPrimitive = string | number | boolean | null;
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
export type JSONObject = { [member: string]: JSONValue };
export type JSONArray = Array<JSONValue>;

export type JSONParseable = JSONObject | JSONArray | JSONPrimitive | Date;

/**
 *
 * @param o
 * @param u
 */
export async function asyncDeepEquals(o: JSONParseable, u: JSONParseable): Promise<boolean> {
  return o === u;
}

const reviver = (key: string, value: unknown) => {
  if (typeof value === 'string') {
    const dateStringMatch = /^Date\((.+)\)$/.exec(value);
    // console.log('dateStringMatch', dateStringMatch, '0', value);
    if (dateStringMatch) {
      return new Date(dateStringMatch[1]);
    }
  }
  return value;
};

export function deepCopy<T extends JSONParseable>(o: T): T {
  const dateFormatter = function (this: Record<string, JSONParseable>, name: string, value: unknown) {
    const property = this[name];

    if (property instanceof Date) {
      return `Date(${property.toISOString()})`;
    }
    return value;
  };
  const stringified = JSON.stringify(o, dateFormatter);
  const parsed = JSON.parse(stringified, reviver);
  return parsed;
}
