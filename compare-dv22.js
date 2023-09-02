const fs = require("fs");
const csv = require("csv-parser");

const csvFiles = [
  { order: 1, path: "dv2022/FY2022-ceac-2022-01-01.csv", date: "2022-01-01" },
  { order: 2, path: "dv2022/FY2022-ceac-2022-01-02.csv", date: "2022-01-02" },
  { order: 3, path: "dv2022/FY2022-ceac-2022-01-15.csv", date: "2022-01-15" },
  { order: 4, path: "dv2022/FY2022-ceac-2022-01-22.csv", date: "2022-01-22" },
  { order: 5, path: "dv2022/FY2022-ceac-2022-01-29.csv", date: "2022-01-29" },
  { order: 6, path: "dv2022/FY2022-ceac-2022-02-01.csv", date: "2022-02-01" },
  { order: 7, path: "dv2022/FY2022-ceac-2022-02-05.csv", date: "2022-02-05" },
  { order: 8, path: "dv2022/FY2022-ceac-2022-02-12.csv", date: "2022-02-12" },
  { order: 9, path: "dv2022/FY2022-ceac-2022-02-16.csv", date: "2022-02-16" },
  { order: 10, path: "dv2022/FY2022-ceac-2022-02-19.csv", date: "2022-02-19" },
  { order: 11, path: "dv2022/FY2022-ceac-2022-02-26.csv", date: "2022-02-26" },
  { order: 12, path: "dv2022/FY2022-ceac-2022-03-05.csv", date: "2022-03-05" },
  { order: 13, path: "dv2022/FY2022-ceac-2022-03-12.csv", date: "2022-03-12" },
  { order: 14, path: "dv2022/FY2022-ceac-2022-03-19.csv", date: "2022-03-19" },
  { order: 15, path: "dv2022/FY2022-ceac-2022-03-26.csv", date: "2022-03-26" },
  { order: 16, path: "dv2022/FY2022-ceac-2022-04-02.csv", date: "2022-04-02" },
  { order: 17, path: "dv2022/FY2022-ceac-2022-04-09.csv", date: "2022-04-09" },
  { order: 18, path: "dv2022/FY2022-ceac-2022-04-16.csv", date: "2022-04-16" },
  { order: 19, path: "dv2022/FY2022-ceac-2022-05-07.csv", date: "2022-05-07" },
  { order: 20, path: "dv2022/FY2022-ceac-2022-05-14.csv", date: "2022-05-14" },
  { order: 21, path: "dv2022/FY2022-ceac-2022-05-21.csv", date: "2022-05-21" },
  { order: 22, path: "dv2022/FY2022-ceac-2022-05-28.csv", date: "2022-05-28" },
  { order: 23, path: "dv2022/FY2022-ceac-2022-06-04.csv", date: "2022-06-04" },
  { order: 24, path: "dv2022/FY2022-ceac-2022-06-11.csv", date: "2022-06-11" },
  { order: 25, path: "dv2022/FY2022-ceac-2022-06-18.csv", date: "2022-06-18" },
  { order: 26, path: "dv2022/FY2022-ceac-2022-06-25.csv", date: "2022-06-25" },
  { order: 27, path: "dv2022/FY2022-ceac-2022-07-02.csv", date: "2022-07-02" },
  { order: 28, path: "dv2022/FY2022-ceac-2022-07-09.csv", date: "2022-07-09" },
  { order: 29, path: "dv2022/FY2022-ceac-2022-07-23.csv", date: "2022-07-23" },
  { order: 30, path: "dv2022/FY2022-ceac-2022-07-30.csv", date: "2022-07-30" },
  { order: 31, path: "dv2022/FY2022-ceac-2022-08-06.csv", date: "2022-08-06" },
  { order: 32, path: "dv2022/FY2022-ceac-2022-08-13.csv", date: "2022-08-13" },
  { order: 33, path: "dv2022/FY2022-ceac-2022-08-20.csv", date: "2022-08-20" },
  { order: 34, path: "dv2022/FY2022-ceac-2022-08-27.csv", date: "2022-08-27" },
  { order: 35, path: "dv2022/FY2022-ceac-2022-09-03.csv", date: "2022-09-03" },
  { order: 36, path: "dv2022/FY2022-ceac-2022-09-10.csv", date: "2022-09-10" },
  { order: 37, path: "dv2022/FY2022-ceac-2022-09-17.csv", date: "2022-09-17" },
  { order: 38, path: "dv2022/FY2022-ceac-2022-09-24.csv", date: "2022-09-24" },
  { order: 39, path: "dv2022/FY2022-ceac-2022-10-01.csv", date: "2022-10-01" },
  { order: 40, path: "dv2022/FY2022-ceac-2022-10-05.csv", date: "2022-10-05" },
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
        const oldpotentialAP = parseInt(oldRow.potentialAP) || 0;
        const newpotentialAP = parseInt(correspondingNewRow.potentialAP) || 0;

        if (oldpotentialAP === 0 && newpotentialAP > 0) {
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
        } else if (oldpotentialAP > 0 && newpotentialAP === 0) {
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
  exportToJSON(filteredDifferences, "differences-dv22.json");
  exportToCSV(filteredDifferences, "differences-dv22.csv");
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
    if (row.caseNumberFull === caseNumber && parseInt(row.potentialAP) > 0) {
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
