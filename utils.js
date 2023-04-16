const keyToText = (value) =>
  value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());

const isRequired = (validate) => {
  if (!validate) {
    return false;
  }
  for (const rule of validate) {
    if (rule.require) {
      return true;
    }
  }
  return false;
};

const getNumberFromString = (str) => {
  const match = str.match(/\d+/);
  if (match) {
    return parseInt(match[0], 10);
  }
  return null;
};

const getCell = (rowCurrent, nameColumn) => {
  return `${nameColumn}${rowCurrent + 1}`;
};

const date = new Date();
const currentDate =
  date.getFullYear() +
  "-" +
  ("0" + (date.getMonth() + 1)).slice(-2) +
  "-" +
  ("0" + date.getDate()).slice(-2) +
  " " +
  ("0" + date.getHours()).slice(-2) +
  ":" +
  ("0" + date.getMinutes()).slice(-2);

module.exports = { keyToText, isRequired, currentDate, getCell };
