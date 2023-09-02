const fs = require("fs");
const csv = require("csv-parser");

const csvFiles = [
  { order: 1, path: "dv2023/0-zero.csv", date: "2023-01-01" },
  { order: 2, path: "dv2023/1-jan.csv", date: "2023-01-02" },
  { order: 3, path: "dv2023/7-jan.csv", date: "2023-01-7" },
  { order: 4, path: "dv2023/14-jan.csv", date: "2023-01-14" },
  { order: 5, path: "dv2023/21-jan.csv", date: "2023-01-21" },
  { order: 6, path: "dv2023/28-jan.csv", date: "2023-01-28" },
  { order: 7, path: "dv2023/4-feb.csv", date: "2023-02-04" },
  { order: 8, path: "dv2023/11-feb.csv", date: "2023-02-11" },
  { order: 9, path: "dv2023/18-feb.csv", date: "2023-02-18" },
  { order: 10, path: "dv2023/25-feb.csv", date: "2023-02-25" },
  { order: 11, path: "dv2023/4-mar.csv", date: "2023-03-04" },
  { order: 12, path: "dv2023/11-mar.csv", date: "2023-03-11" },
  { order: 13, path: "dv2023/18-mar.csv", date: "2023-03-18" },
  { order: 14, path: "dv2023/25-mar.csv", date: "2023-03-25" },
  { order: 15, path: "dv2023/1-apr.csv", date: "2023-04-01" },
  { order: 16, path: "dv2023/8-apr.csv", date: "2023-04-08" },
  { order: 17, path: "dv2023/15-apr.csv", date: "2023-04-15" },
  { order: 18, path: "dv2023/22-apr.csv", date: "2023-04-22" },
  { order: 19, path: "dv2023/29-apr.csv", date: "2023-04-29" },
  { order: 20, path: "dv2023/6-may.csv", date: "2023-05-06" },
  { order: 21, path: "dv2023/13-may.csv", date: "2023-05-13" },
  { order: 22, path: "dv2023/20-may.csv", date: "2023-05-20" },
  { order: 23, path: "dv2023/27-may.csv", date: "2023-05-27" },
  { order: 24, path: "dv2023/3-jun.csv", date: "2023-06-03" },
  { order: 25, path: "dv2023/10-jun.csv", date: "2023-06-10" },
  { order: 26, path: "dv2023/17-jun.csv", date: "2023-06-17" },
  { order: 27, path: "dv2023/24-jun.csv", date: "2023-06-24" },
  { order: 28, path: "dv2023/1-jul.csv", date: "2023-07-01" },
  { order: 29, path: "dv2023/8-jul.csv", date: "2023-07-08" },
  { order: 30, path: "dv2023/15-jul.csv", date: "2023-07-15" },
  { order: 31, path: "dv2023/22-jul.csv", date: "2023-07-22" },
  { order: 32, path: "dv2023/29-jul.csv", date: "2023-07-29" },
  { order: 33, path: "dv2023/5-aug.csv", date: "2023-08-05" },
  { order: 34, path: "dv2023/12-aug.csv", date: "2023-08-12" },
  { order: 35, path: "dv2023/26-aug.csv", date: "2023-08-26" },
  { order: 36, path: "dv2023/02-sep.csv", date: "2023-09-02" },
];

function getCurrentTimestamp() {
  return new Date().toLocaleString();
}

const dataByDate = {};

// Read and organize data from all CSV files by date
csvFiles.sort((a, b) => a.order - b.order); // Sort csvFiles array by order
for (const csvFile of csvFiles) {
  const data = [];
  fs.createReadStream(csvFile.path)
    .pipe(csv())
    .on("data", (row) => {
      data.push(row);
    })
    .on("end", () => {
      dataByDate[csvFile.date] = data;
      if (Object.keys(dataByDate).length === csvFiles.length) {
        compareAndExport(dataByDate);
      }
    });
}

function compareAndExport(dataByDate) {
  console.log("Starting comparison and export process...");
  const differences = [];
  let idCounter = 1;
  const dayOf221gValues = {}; // Object to track dayOf221g values

  for (let i = 1; i < csvFiles.length; i++) {
    const currentDate = csvFiles[i - 1].date;
    const nextDate = csvFiles[i].date;
    const currentData = dataByDate[currentDate];
    const nextData = dataByDate[nextDate];

    console.log(
      `[${getCurrentTimestamp()}] Comparing ${currentDate} with ${nextDate}`
    );

    for (const oldRow of currentData) {
      const correspondingNewRow = nextData.find(
        (newRow) => newRow.caseNumberFull === oldRow.caseNumberFull
      );
      if (correspondingNewRow) {
        const oldRefused221g = parseInt(oldRow.Refused221g) || 0;
        const newRefused221g = parseInt(correspondingNewRow.Refused221g) || 0;

        if (oldRefused221g === 0 && newRefused221g > 0) {
          dayOf221gValues[oldRow.caseNumberFull] =
            correspondingNewRow.statusDate; // Store dayOf221g value
          differences.push({
            id: idCounter++,
            caseNumberFull: oldRow.caseNumberFull,
            date: nextDate,
            consulate: correspondingNewRow.consulate,
            region: oldRow.region,
            status: correspondingNewRow.status,
            dayOf221g: correspondingNewRow.statusDate,
            solvedInDays: null,
            howManyDaysInAP: calculateDaysPassed(
              correspondingNewRow.statusDate,
              new Date()
            ),
          });
        } else if (oldRefused221g > 0 && newRefused221g === 0) {
          let dayOf221g =
            dayOf221gValues[oldRow.caseNumberFull] ||
            getDayOf221g(currentData, oldRow.caseNumberFull);
          if (!dayOf221g) {
            dayOf221g = csvFiles[0].date;
          }
          const solvedInDays = calculateDaysPassed(
            dayOf221g,
            correspondingNewRow.statusDate
          );
          differences.push({
            id: idCounter++,
            caseNumberFull: oldRow.caseNumberFull,
            consulate: correspondingNewRow.consulate,
            region: oldRow.region,
            status: correspondingNewRow.status,
            date: nextDate,
            endOf221g: correspondingNewRow.statusDate,
            dayOf221g: dayOf221g, // Use the stored dayOf221g value
            solvedInDays: solvedInDays,
            howManyDaysInAP:
              solvedInDays !== null
                ? solvedInDays
                : calculateDaysPassed(dayOf221g, new Date()),
          });
        }
      }
    }
  }

  const filteredDifferences = filterDuplicateCases(differences);
  exportToJSON(filteredDifferences, "differences.json");
  exportToCSV(filteredDifferences, "differences.csv");
}

function filterDuplicateCases(data) {
  const caseMap = new Map();

  for (const item of data) {
    if (
      !caseMap.has(item.caseNumberFull) ||
      item.id > caseMap.get(item.caseNumberFull).id
    ) {
      caseMap.set(item.caseNumberFull, item);
    }
  }

  return Array.from(caseMap.values());
}

function getDayOf221g(data, caseNumber) {
  for (const row of data) {
    if (row.caseNumberFull === caseNumber && parseInt(row.Refused221g) > 0) {
      return row.date;
    }
  }
  return null;
}

function calculateDaysPassed(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDifference = end - start;
  const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  return daysPassed;
}

function exportToJSON(data, filePath) {
  const jsonData = JSON.stringify(data, null, 2);

  fs.writeFile(filePath, jsonData, (err) => {
    if (err) {
      console.error("Error writing JSON file:", err);
    } else {
      const timestamp = new Date().toLocaleString();
      console.log(`[${timestamp}] Differences exported to ${filePath}`);
    }
  });
}

function exportToCSV(data, filePath) {
  const csvData = [
    [
      "ID",
      "region",
      "status",
      "Case Number Full",
      "Consulate",
      "221g Date",
      "End of 221g Date",
      "solvedInDays",
      "How Many Days in AP",
    ],
  ];

  for (const item of data) {
    csvData.push([
      item.id,
      item.region,
      item.status,
      item.caseNumberFull,
      item.consulate,
      item.dayOf221g || "",
      item.endOf221g || "",
      item.solvedInDays || "",
      item.howManyDaysInAP || "",
    ]);
  }

  const csvContent = csvData.map((row) => row.join(",")).join("\n");

  fs.writeFile(filePath, csvContent, (err) => {
    if (err) {
      console.error("Error writing CSV file:", err);
    } else {
      const timestamp = new Date().toLocaleString();
      console.log(`[${timestamp}] Differences exported to ${filePath}`);
    }
  });
}
