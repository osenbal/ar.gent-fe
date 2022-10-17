export const isEmpty = (
  value: string | number | object | undefined
): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (
    value !== null &&
    typeof value === 'object' &&
    !Object.keys(value).length
  ) {
    return true;
  } else {
    return false;
  }
};

export const onlyNumberKeyInput = (evt: any) => {
  // Only ASCII character in that range allowed
  var ASCIICode = evt.which ? evt.which : evt.keyCode;
  if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) return false;
  return true;
};

export const getCookieValue = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts: string[] = value.split(`; ${name}=`);

  return parts;
  // if (parts.length === 2 && parts) return parts.pop().split(';').shift();
};
