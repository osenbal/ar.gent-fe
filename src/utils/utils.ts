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

export const parseDate = (date: Date) => {
  const yyyy = date.getFullYear();
  let mm = (date.getMonth() + 1).toString(); // Months start at 0!
  let dd = date.getDate().toString();

  if (Number(dd) < 10) dd = '0' + dd;
  if (Number(mm) < 10) mm = '0' + mm;

  const formattedToday = yyyy + '-' + mm + '-' + dd;

  return formattedToday;
};
