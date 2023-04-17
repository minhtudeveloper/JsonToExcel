const XLSX = require("xlsx");
const XLSXStyle = require("xlsx-style");
const fs = require("fs");

const data = require("./Features/Top/api_login");
const path = require("path");
const {
  keyToText,
  isRequired,
  currentDate,
  getCell,
  tab_1,
  convertMessagesToString,
  multiplierTab,
  checkMin_F,
  checkMax_F,
  tab_2,
} = require("./utils");

const origin1 = "B2";
let rowCurrent = 2;

// Create a new workbook
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet([]);

const styleCellHeaderTable = {
  font: { bold: true },
  fill: { patternType: "solid", fgColor: { rgb: "C6E0B4" } },
};
const styleSession = {
  font: { bold: true, sz: 16 },
  alignment: { wrapText: true },
  fill: { patternType: "solid", fgColor: { rgb: "ffc000" } },
};
const styleCellTable = {
  font: { sz: 10 },
  alignment: { wrapText: true, vertical: "center" },
};

const writeExcel = (dataWrite) => {
  XLSX.utils.sheet_add_json(ws, dataWrite.data, {
    skipHeader: true,
    origin: dataWrite.origin,
  });
  rowCurrent += dataWrite.data.length;
};

// ** session 1
const session1 = () => {
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
  const DataWsInfo = wsInfo(data.info);
  writeExcel(DataWsInfo);
};
if (data.info) session1();

// ** session 2
const session2 = () => {
  const wsRequest = (fields) => {
    try {
      const data = [];
      fields.forEach((field, index) => {
        const { description, name, type, note, validate, values } = field;
        const checkRequest = isRequired(validate);
        const checkMin = checkMin_F(validate);
        const checkMax = checkMax_F(validate);
        if (type.toLowerCase() === "array" || type.toLowerCase() === "object") {
          let ob = values[0];
          if (type.toLowerCase() === "object") ob = values;
          data.push([
            { v: index + 1, s: styleCellTable },
            { v: description, s: styleCellTable },
            { v: name, s: styleCellTable },
            { v: type, s: styleCellTable },
            {
              v: `${checkRequest ? "yes" : "no"}${tab_1} - ${tab_1}${
                checkMin ? checkMin : "no"
              }${tab_1} - ${tab_1}${checkMax ? checkMax : "no"}`,
              s: styleCellTable,
            },
            { v: note, s: styleCellTable },
          ]);
          console.log({ ob });
          if (typeof ob === "object") {
            let indexOb = 0;
            for (const [key, value] of Object.entries(ob)) {
              indexOb++;
              data.push([
                { v: `${index + 1}.${indexOb}`, s: styleCellTable },
                {
                  v: `${tab_1}${value.description}`,
                  s: styleCellTable,
                },
                { v: `${tab_1}${key}`, s: styleCellTable },
                { v: value.type, s: styleCellTable },
                {
                  v: `${
                    isRequired(value.validate) ? "yes" : "no"
                  }${tab_1} - ${tab_1}${
                    checkMin_F(value.validate)
                      ? checkMin_F(value.validate)
                      : "no"
                  }${tab_1} - ${tab_1}${
                    checkMax_F(value.validate)
                      ? checkMax_F(value.validate)
                      : "no"
                  }`,
                  s: styleCellTable,
                },
                { v: value.note, s: styleCellTable },
              ]);
            }
          }
          return;
        }
        data.push([
          { v: index + 1, s: styleCellTable },
          { v: description, s: styleCellTable },
          { v: name, s: styleCellTable },
          { v: type, s: styleCellTable },
          {
            v: `${checkRequest ? "yes" : "no"}${tab_1} - ${tab_1}${
              checkMin ? checkMin : "no"
            }${tab_1} - ${tab_1}${checkMax ? checkMax : "no"}`,
            s: styleCellTable,
          },
          { v: note, s: styleCellTable },
        ]);
      });

      return {
        data,
        origin: getCell(rowCurrent, "B"),
      };
    } catch (error) {
      console.log("Lỗi format data Validate");
    }
  };
  const header_ws2 = [
    [{ v: "Request", s: styleSession }],
    [
      { v: "####", s: styleCellHeaderTable },
      { v: "Item", s: styleCellHeaderTable },
      { v: "Tên Vật Lý", s: styleCellHeaderTable },
      { v: "Kiểu data (Max)", s: styleCellHeaderTable },
      { v: "Required - Min - Max (validate)", s: styleCellHeaderTable },
      { v: "Ghi chú", s: styleCellHeaderTable },
    ],
  ];
  writeExcel({ data: header_ws2, origin: getCell(rowCurrent, "B") });

  const dataWWsRequest = wsRequest(data.fields);
  writeExcel(dataWWsRequest);
};
if (data.fields) session2();
// session 2 **

// ** session 3
const session3 = () => {
  rowCurrent += 3;
  writeExcel({
    data: [[{ v: "Process", s: styleSession }]],
    origin: getCell(rowCurrent, "B"),
  });

  writeExcel({
    data: [
      [
        { v: "1", s: styleCellHeaderTable },
        { v: "Check request parameter", s: styleCellHeaderTable },
      ],
    ],
    origin: getCell(rowCurrent, "B"),
  });
  writeExcel({
    data: [[tab_1 + "■ Check Validate", data.errorValidate]],
    origin: getCell(rowCurrent, "B"),
  });

  const wsValidate = (fields) => {
    try {
      const data = [];
      fields.forEach((field, index) => {
        const { description, name, type, note, validate } = field;
        if (!validate || validate.length === 0) return;
        validate.forEach((item, indexV) => {
          if (item.require) {
            data.push([{ v: `${name} không có`, s: styleCellTable }]);
            data.push([{ v: tab_1 + `${item.message}`, s: styleCellTable }]);
          }
          if (item.min) {
            data.push([
              { v: `${name} có độ dài nhỏ hơn ${item.min}`, s: styleCellTable },
            ]);
            data.push([{ v: tab_1 + `${item.message}`, s: styleCellTable }]);
          }
          if (item.max) {
            data.push([
              { v: `${name} có độ dài lớn hơn ${item.max}`, s: styleCellTable },
            ]);
            data.push([{ v: tab_1 + `${item.message}`, s: styleCellTable }]);
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
  writeExcel(dataWSValidate);

  rowCurrent += 1;
  writeExcel({
    data: [
      [
        { v: "2", s: styleCellHeaderTable },
        { v: "Request", s: styleCellHeaderTable },
      ],
    ],
    origin: getCell(rowCurrent, "B"),
  });
  writeExcel({ data: [[tab_1 + "■ Data"]], origin: getCell(rowCurrent, "B") });

  const wsRequest_F = () => {
    const wsRequest = (request) => {
      try {
        let content = "";
        let i = 0;
        const length = Object.entries(request).length;
        for (const [key, value] of Object.entries(request)) {
          i++;
          if (typeof value === "object") {
            content += `${key}: ${tab_1}${JSON.stringify(value)} ${
              length === i ? "" : "\n"
            }`;
            continue;
          }
          content += `${key}: ${value} ${length === i ? "" : "\n"}`;
        }
        return {
          data: [[{ v: content, s: styleCellTable }]],
          origin: getCell(rowCurrent, "C"),
        };
      } catch (error) {
        console.log("Lỗi format data Request");
      }
    };
    const dataWSRequest = wsRequest(data.request);
    writeExcel(dataWSRequest);
  };
  if (data.request) wsRequest_F();

  rowCurrent += 1;
  writeExcel({
    data: [
      [
        { v: "3", s: styleCellHeaderTable },
        { v: "Status Response", s: styleCellHeaderTable },
      ],
    ],
    origin: getCell(rowCurrent, "B"),
  });

  writeExcel({
    data: [[tab_1 + "■ Status"]],
    origin: getCell(rowCurrent, "B"),
  });

  const wsStatusResponse_F = () => {
    const wsStatusReponse = (status) => {
      try {
        let data = [];
        status.forEach((item, index) => {
          data.push([{ v: item.description, s: styleCellTable }]);
          data.push([{ v: `${tab_1}OK`, s: styleCellTable }]);
          data.push([{ v: `${tab_2}${item.ok}`, s: styleCellTable }]);
          data.push([{ v: `${tab_1}Not Ok`, s: styleCellTable }]);
          data.push([{ v: `${tab_2}${item.notOk}`, s: styleCellTable }]);
        });

        return {
          data,
          origin: getCell(rowCurrent, "C"),
        };
      } catch (error) {
        console.log("Lỗi format data Status Reponse ");
      }
    };
    if (data.response.status) {
      const dataWSStatusRespone = wsStatusReponse(data.response.status);
      writeExcel(dataWSStatusRespone);
    }
  };
  if (data.response) wsStatusResponse_F();
};
if (data.fields) session3();
// session 3 **

// ** session 4
const session4 = () => {
  rowCurrent += 3;
  const header_ws4_ok = [
    [{ v: "Response", s: styleSession }],
    [{ v: "■ Ok", s: styleCellHeaderTable }],
    [
      { v: "####", s: styleCellHeaderTable },
      { v: "Item", s: styleCellHeaderTable },
      { v: "Tên Vật Lý", s: styleCellHeaderTable },
      { v: "Value", s: styleCellHeaderTable },
      { v: "Kiểu data", s: styleCellHeaderTable },
      { v: "Ghi chú", s: styleCellHeaderTable },
    ],
  ];

  writeExcel({ data: header_ws4_ok, origin: getCell(rowCurrent, "B") });

  const wsResponse = (response) => {
    let count = 0;
    let i = 0;
    let j = 0;
    const genResponse = (object) => {
      let rp = [];
      count++;
      for (const [key, value] of Object.entries(object)) {
        if (j === 0) i++;
        if (typeof value !== "object") {
          rp.push([
            { v: `${i}${j === 0 ? "" : `.${j}`}`, s: styleCellTable },
            { v: keyToText(key), s: styleCellTable },
            { v: `${multiplierTab(count)}${key}`, s: styleCellTable },
            { v: value, s: styleCellTable },
            { v: typeof value, s: styleCellTable },
          ]);
          if (j !== 0) j++;
          else count = 1;
          continue;
        }

        rp.push([
          { v: `${i}${j === 0 ? "" : `.${j}`}`, s: styleCellTable },
          { v: keyToText(key), s: styleCellTable },
          { v: `${multiplierTab(count)}${key}`, s: styleCellTable },
          { v: value, s: styleCellTable },
          { v: typeof value, s: styleCellTable },
        ]);
        j++;
        rp = rp.concat(genResponse(value));
        j = 0;
        count--;
      }
      return rp;
    };
    return {
      data: genResponse(response),
      origin: getCell(rowCurrent, "B"),
    };
  };
  if (data.response.data) {
    const dataWsResponseOk = wsResponse(data.response.data);
    writeExcel(dataWsResponseOk);
  }

  rowCurrent += 1;
  const header_ws4_not_ok = [
    [{ v: "■ Not Ok", s: styleCellHeaderTable }],
    [
      { v: "####", s: styleCellHeaderTable },
      { v: "Item", s: styleCellHeaderTable },
      { v: "Tên Vật Lý", s: styleCellHeaderTable },
      { v: "Value", s: styleCellHeaderTable },
      { v: "Kiểu data", s: styleCellHeaderTable },
      { v: "Ghi chú", s: styleCellHeaderTable },
    ],
  ];

  writeExcel({ data: header_ws4_not_ok, origin: getCell(rowCurrent, "B") });
  if (data.response.data_error) {
    const dataWsResponseNotOk = wsResponse(data.response.data_error);
    writeExcel(dataWsResponseNotOk);
  }
};
if (data.response.data) session4();
// session 4 **

// ** session 5
const session5 = () => {
  rowCurrent += 3;
  const header_ws5 = [
    [{ v: "Error code", s: styleSession }],
    [
      { v: "Code", s: styleCellHeaderTable },
      { v: "Nội Dung", s: styleCellHeaderTable },
      { v: "Message", s: styleCellHeaderTable },
      { v: "Note", s: styleCellHeaderTable },
    ],
  ];

  writeExcel({ data: header_ws5, origin: getCell(rowCurrent, "B") });

  const wsError = (errors) => {
    const dataError = [];
    errors.map((error, index) => {
      if (!error) return;
      const { code, content, messages, note } = error;
      dataError.push([
        { v: code, s: styleCellTable },
        { v: content, s: styleCellTable },
        { v: convertMessagesToString(messages), s: styleCellTable },
        { v: note, s: styleCellTable },
      ]);
    });
    return {
      data: dataError,
      origin: getCell(rowCurrent, "B"),
    };
  };
  const dataWsErros = wsError(data.errors);
  writeExcel(dataWsErros);
};
if (data.errors) session5();
// session 5 **

const wsAll = { ...ws };
wsAll["!cols"] = [
  { wch: 10 },
  { wch: 20 },
  { wch: 40 },
  { wch: 40 },
  { wch: 40 },
  { wch: 40 },
  { wch: 40 },
];

XLSX.utils.book_append_sheet(wb, wsAll, data.info.api_name);
console.log("name : ", `${data.files.dirname}\${data.files.name}.xlsx`);
// Write the workbook to a file
const newFolderPath = path.join(data.files.dirname);
fs.mkdir(newFolderPath, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Folder created successfully at ${newFolderPath}`);
  }
});

XLSXStyle.writeFile(
  wb,
  path.join(`${data.files.dirname}`, `${data.files.name}.xlsx`)
);
