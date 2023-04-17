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

const checkMin_F = (validate) => {
  if (!validate) {
    return false;
  }
  for (const rule of validate) {
    if (rule.min) {
      return rule.min;
    }
  }
  return false;
};

const checkMax_F = (validate) => {
  if (!validate) {
    return false;
  }
  for (const rule of validate) {
    if (rule.min) {
      return rule.min;
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

const tab_1 = "    ";
const tab_2 = "        ";

const convertMessagesToString = (messages) => {
  if (typeof messages === "string") return messages;
  let content = "";
  messages.forEach((item, index) => {
    content += `${index + 1} ${item} ${
      index + 1 === messages.length ? "" : "\n"
    }`;
  });
  return content;
};

const multiplierTab = (count) => {
  let content = "";
  for (let i = 1; i < count; i++) {
    content += tab_1;
  }
  return content;
};

module.exports = {
  keyToText,
  isRequired,
  currentDate,
  getCell,
  tab_1,
  tab_2,
  convertMessagesToString,
  multiplierTab,
  checkMin_F,
  checkMax_F,
};
