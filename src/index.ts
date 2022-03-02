import { fail } from "assert";
import { diffieHellman, KeyObject, privateEncrypt } from "crypto";
import { anything, array, jsonValue } from "fast-check";
import { JsonObject } from "fast-check/lib/types/arbitrary/_internals/helpers/JsonConstraintsBuilder";
import { arrayBuffer } from "stream/consumers";

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
    // Finding if u and o are JSONObjects or not
    if(o && u && o instanceof Object && u instanceof Object || o != null && typeof o == 'object' && u != null && typeof u == 'object' )
    {
        const obj1Length = Object.keys(o).length;
        const obj2Length = Object.keys(u).length;
        // If confirmed objects thn both has the same number of keys-values pair
        if (obj1Length === obj2Length) {
            // Incase o and u are array or date types, if it is date then convert into string and compare. If it is array compare then each values needs
            // to be converted to string 
            if(o instanceof Date || Array.isArray(o) || u instanceof Date || Array.isArray(u))
            {
                if (o instanceof Date && u instanceof Date)
                {
                    return o.toISOString() === u.toISOString();
                }
                else if(Array.isArray(o) && Array.isArray(u))
                {
                    let date_array = false;
                    let Array1: string[] = []; //for date arrays, explicitly saving in string array upon converting all date values to string
                    let Array2: string[] = [];
                    const iterator = o.values();
                    let i = 0;
                    let j = 0;
                
                    for (const value1 of iterator) {
                        if(value1 instanceof Date)
                        {    
                            Array1[i++]= value1.toISOString();
                            date_array = true;
                        }
                    }
                    const iterator2 = u.values();
                    for (const value2 of iterator2) {
                        if(value2 instanceof Date)
                        {
                            Array2[j++]= value2.toISOString();
                            date_array = true;
                        }
                    }

                    // straight compare of the string, boolean, and number values based array after converting all values to string
                    if(date_array == false)
                    {
                        let diff = [];
                        if (o.length != u.length) 
                        {
                            return false;
                        }
                        else if (o.length >= u.length) // this can be optimised
                        {
                            diff = o.filter((item: any) => u.indexOf(item) < 0); // Considers different permutations
                        } 
                        else 
                        {
                            diff = u.filter((item: any) => o.indexOf(item) < 0); // Considers different permutations
                        }
                        return !diff.length;
                    }
                    else // using string array Array1 and Array2 for comparision
                    {
                        let diff = [];
                        if (o.length != u.length) 
                        {
                            return false;
                        }
                        else if (Array1.length >= Array2.length) // this can be optimised
                        {
                            diff = Array1.filter((item: any) => Array2.indexOf(item) < 0); // Considers different permutations
                        }
                        else 
                        {
                            diff = Array2.filter((item: any) => Array1.indexOf(item) < 0); // Considers different permutations
                        }
                        return !diff.length;
                    }          
                }
            }
            else{
                for ( var p in o ) {
                    if ( ! o.hasOwnProperty(p) ) continue;
                    if ( ! u.hasOwnProperty(p) ) return false;

                    // allows to compare x[ p ] and y[ p ] when set to undefined
                    // Using keys to find similar keys in other object and finding value based on it, considers different permutations
                    if ( o[p] === u[p]) continue;
                    let o11 = o[p];
                    let u11 = u[p];

                    //Converting object values to string for comparision
                    if(o11 != null && u11 !=null)
                    {
                        if(o11.toString() === u11.toString())
                        {
                            return true;
                        } 
                    }

                    // Numbers, Strings, Functions, Booleans must be strictly equal
                    if ( typeof( o[p] ) !== "object" ) return false;
                    
                    // Objects and Arrays must be tested recursively
                    if (o[p] != u[p] ) return false;
                }
                for (var p1 in u ) {
                    if ( u.hasOwnProperty( p1 ) && ! o.hasOwnProperty( p1 ) ) return false;
                    // allows x[ p ] to be set to undefined

                    if (o.p1 != u.p1)
                    {
                        return false;
                    }
                }
                return true;                  
            }
        }
    }
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

function _(_: any, o: string | number | boolean | JSONObject | JSONArray | Date | null) {
    throw new Error("Function not implemented.");
}

function equal(arg0: any, arg1: any) {
    throw new Error("Function not implemented.");
}
