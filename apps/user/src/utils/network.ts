export function searchParamsToObject(searchParams: URLSearchParams) {
  const paramsObj: Record<string, string[] | string> = {};

  // Iterate over the search parameters and add them to the object
  for (const [key, value] of searchParams.entries()) {
    const existingValue = paramsObj[key];
    if (existingValue) {
      // If the key already exists, add the new value to the array
      if (Array.isArray(existingValue)) {
        existingValue.push(value);
      } else {
        paramsObj[key] = [existingValue, value];
      }
    } else {
      // If the key doesn't exist, add it to the object
      paramsObj[key] = value;
    }
  }

  return paramsObj;
}
