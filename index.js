const XLSX = require("xlsx");
const data = require("./dataConvert");
const path = require("path");
const { keyToText, isRequired, currentDate, getCell } = require("./utils");

const origin1 = "B2";

let rowCurrent = 2;

// Create a new workbook
const wb = XLSX.utils.book_new();

// Create a new worksheet
const ws = XLSX.utils.json_to_sheet([]);
// ws["A1"] = { t: "s", v: "Leo" };

// data session 1
const wsInfo = (info) => {
  let data = [];
  try {
    data.push([`■ Time`]);
    data.push([currentDate]);
    data.push([""]);
    for (const [key, value] of Object.entries(info)) {
      data.push([`■ ${keyToText(key)}`]);
      data.push([value]);
      data.push([""]);
    }
    return {
      data,
      origin: origin1,
    };
  } catch (error) {
    console.log("Lỗi format data inFo");
  }
};

// data session 2
const wsRequest = (fields) => {
  try {
    const data = fields.map((field, index) => {
      const { description, name, type, note, validate } = field;
      const check = isRequired(validate);
      return [index + 1, description, name, type, check ? "yes" : "", note];
    });

    return {
      data,
      origin: getCell(rowCurrent, "B"),
    };
  } catch (error) {
    console.log("Lỗi format data Validate");
  }
};

// ** session 1
const DataWsInfo = wsInfo(data.info);
XLSX.utils.sheet_add_json(ws, DataWsInfo.data, {
  skipHeader: true,
  origin: DataWsInfo.origin,
});
rowCurrent += DataWsInfo.data.length;
// session 1 **

// ** session 2
const header = [
  ["Request"],
  ["#", "Item", "Tên Vật Lý", "Kiểu data (Max)", "Bắt buộc", "Ghi chú"],
];

XLSX.utils.sheet_add_json(ws, header, {
  skipHeader: true,
  origin: getCell(rowCurrent, "B"),
});
console.log("11 : ", { rowCurrent });
rowCurrent += 2;
const dataWWsRequest = wsRequest(data.fields);
XLSX.utils.sheet_add_json(ws, dataWWsRequest.data, {
  skipHeader: true,
  origin: dataWWsRequest.origin,
});
rowCurrent += dataWWsRequest.data.length;
console.log("222 : ", { rowCurrent });
// session 2 **

//** */ session 3
rowCurrent += 3;
console.log({ rowCurrent });
XLSX.utils.sheet_add_json(ws, [["■ Process"]], {
  skipHeader: true,
  origin: getCell(rowCurrent, "B"),
});
rowCurrent += 1;

XLSX.utils.sheet_add_json(ws, [["1", "Check request parameter"]], {
  skipHeader: true,
  origin: getCell(rowCurrent, "B"),
});
rowCurrent += 1;

XLSX.utils.sheet_add_json(ws, [["\t" + "Check Validate"]], {
  skipHeader: true,
  origin: getCell(rowCurrent, "B"),
});
rowCurrent += 1;

// session 3 **

const wsValidate = (fields) => {
  try {
    const data = [];
    fields.forEach((field, index) => {
      const { description, name, type, note, validate } = field;
      if (!validate || validate.length === 0) return;
      validate.forEach((item, indexV) => {
        if (item.require) {
          data.push([`${name} không có`]);
          data.push(["\t" + `${item.message}`]);
        }
        if (item.min) {
          data.push([`${name} có độ dài nhỏ hơn ${item.min}`]);
          data.push(["\t" + `${item.message}`]);
        }
        if (item.max) {
          data.push([`${name} có độ dài lớn hơn ${item.max}`]);
          data.push(["\t" + `${item.message}`]);
        }
      });
    });

    return {
      data,
      origin: getCell(rowCurrent, "C"),
    };
  } catch (error) {
    console.log("Lỗi format data Validate");
  }
};

const dataWSValidate = wsValidate(data.fields);
XLSX.utils.sheet_add_json(ws, dataWSValidate.data, {
  skipHeader: true,
  origin: dataWSValidate.origin,
});
rowCurrent += dataWSValidate.data.length;
// const dataTable = [
//   ["#", "Name", "Age", "Email"],
//   [1, "Alice", 25, "alice@example.com"],
//   [2, "Bob"0, "bob@example.com"],
//   [3, "Charlie", 35, "charlie@example.com"],
// ];

// XLSX.utils.sheet_add_aoa(ws, dataTable, { origin: "B17" });

// Add the worksheet to the workbook
ws["!cols"] = [
  { width: 5 },
  { width: 30 },
  { width: 30 },
  { width: 30 },
  { width: 30 },
  { width: 30 },
  { width: 30 },
];

XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

// Save the workbook as an Excel file
XLSX.writeFile(wb, path.join(__dirname, "Exports/data.xlsx"));
